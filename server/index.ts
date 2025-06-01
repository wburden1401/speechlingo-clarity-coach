console.log('OpenAI key loaded:', Boolean(process.env.OPENAI_API_KEY));
import { getAudioDurationInSeconds } from 'get-audio-duration';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';
import 'dotenv/config';
import crypto from 'crypto';
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { analyzeAudioFromBlob } from '../src/utils/analyzeAudio';

const upload = multer({ storage: multer.memoryStorage() });
const app = express();
app.use(cors());

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/transcribe', upload.single('audio'), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const filename = `${crypto.randomUUID()}.webm`;
    const tempFilePath = `/tmp/${filename}`;
    await fs.promises.writeFile(tempFilePath, req.file.buffer);
    
    const { data: obj, error: upErr } = await supabase.storage
      .from('speech')
      .upload(filename, req.file.buffer, { contentType: req.file.mimetype });
    if (upErr) throw upErr;
   
    const transcriptResponse = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: fs.createReadStream(tempFilePath),
      response_format: 'text',
    });

    const transcript = transcriptResponse.trim();
    const words = transcript
      .split(/\s+/)
      .map(w => w.replace(/[.,!?;:]/g, '').toLowerCase());
    const wordCount = words.length;

    const audioDuration = parseFloat(req.body.duration) || await getAudioDurationInSeconds(tempFilePath);
    await fs.promises.unlink(tempFilePath);
    const wpm = Math.round((wordCount / audioDuration) * 60);

    res.json({ transcript, wpm });
  } catch (e: any) {
    console.error('Transcribe route error:', e);
    res.status(500).json({ error: e.message ?? 'Server error during transcription' });
    return;
  }
});

async function generateGPTFeedback(transcript: string, azureScores: any, prompt: string) {
  const promptWithContext = `The user was asked to respond to this prompt: "${prompt}"
Based on the following transcription and pronunciation analysis, give clear, practical feedback on how well they answered:
Transcription: ${transcript}

Azure Scores:
Accuracy: ${azureScores.accuracyScore || 'N/A'}
Fluency: ${azureScores.fluencyScore || 'N/A'}
Completeness: ${azureScores.completenessScore || 'N/A'}
Pronunciation: ${azureScores.pronunciationScore || 'N/A'}

Please provide:
1. Overall score (/100)
2. Tone analysis
3. Filler word feedback
4. Pacing feedback
5. Score explanation
6. One concise improvement tip, key: nextTip

Format the response as a JSON object with these exact keys: overallScore, tone, fillerWords, pacing, scoreExplanation`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a professional speech coach providing constructive feedback on speaking performance. Use a friendly, encouraging tone. Start with one short positive note, then constructive feedback. End with one clear, practical tip the user can try next time."
      },
      {
        role: "user",
        content: promptWithContext
      }
    ],
    temperature: 0.7,
  });

  return JSON.parse(completion.choices[0].message?.content || '{}');
}

app.post('/api/analyze-speech', upload.single('audio'), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No audio file provided' });
      return;
    }

    const prompt = req.body.prompt || 'No prompt provided';
    const blob = new Blob([req.file.buffer], { type: 'audio/wav' });

    // Step 1: Transcribe with Whisper
    const formData = new FormData();
    formData.append('audio', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const transcribeRes = await fetch('http://localhost:3001/api/transcribe', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    });
    
    if (!transcribeRes.ok) {
      throw new Error('Transcription failed');
    }

    const { transcript, wpm } = await transcribeRes.json() as { transcript: string; wpm: number };

    // Step 2: Analyze with Azure
    const azureScores = await analyzeAudioFromBlob(blob, transcript);

    // Step 3: Generate GPT feedback
    const gptFeedback = await generateGPTFeedback(transcript, azureScores, prompt);

    // Step 4: Combine all results
    const response = {
      transcript,
      wpm,
      prompt,
      azureScores,
      feedback: {
        ...gptFeedback,
        wpm
      }
    };

    res.json(response);
    return;
  } catch (error) {
    console.error('Analysis error:', error instanceof Error ? error.stack : error);
    res.status(500).json({ error: 'Speech analysis failed', details: (error as Error).message });
    return;
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
