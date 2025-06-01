import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const speechKey = "AwU7yV9kBZrDGS51eRWDKP3vVvnRmk2e62CBnKbd1Ww4CAFP5U3fJQQJ99BEACYeBjFXJ3w3AAAYACOGexDx"; 
const region = "eastus";

interface PronunciationScores {
  accuracyScore?: number;
  fluencyScore?: number;
  completenessScore?: number;
  pronunciationScore?: number;
  text?: string;
  words?: any[];
  error?: string;
}

export async function analyzeAudioFromBlob(blob: Blob, referenceText?: string): Promise<PronunciationScores> {
  return new Promise((resolve, reject) => {
    console.log("Starting Azure analysis...");
    console.log("Blob size:", blob.size);
    console.log("Blob type:", blob.type);

    const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, region);
    speechConfig.speechRecognitionLanguage = "en-US";
    speechConfig.outputFormat = sdk.OutputFormat.Detailed;

    // Convert blob to array buffer
    blob.arrayBuffer().then(arrayBuffer => {
      try {
        const audioData = new Uint8Array(arrayBuffer);
        console.log("Audio data length:", audioData.length);

        const pushStream = sdk.AudioInputStream.createPushStream();
        const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
        const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

        // Configure pronunciation assessment
        const pronunciationConfig = new sdk.PronunciationAssessmentConfig(
          referenceText || "",
          sdk.PronunciationAssessmentGradingSystem.HundredMark,
          sdk.PronunciationAssessmentGranularity.Word,
          true
        );
        pronunciationConfig.applyTo(recognizer);

        // Write audio to Azure stream
        const chunkSize = 4096;
        for (let i = 0; i < audioData.length; i += chunkSize) {
          const chunk = audioData.slice(i, i + chunkSize);
          pushStream.write(chunk);
        }
        pushStream.close();

        recognizer.recognizeOnceAsync(
          result => {
            try {
              console.log("Azure Result reason:", result.reason);
              console.log("Azure Result text:", result.text);

              if (result.reason === sdk.ResultReason.NoMatch || !result.text) {
                reject("No speech was recognized.");
                return;
              }

              const rawJson = result.properties.getProperty(
                sdk.PropertyId.SpeechServiceResponse_JsonResult
              );
              console.log("🔍 Azure Raw JSON:", rawJson);

              const parsed = JSON.parse(rawJson);
              if (parsed?.PronunciationAssessment) {
                const scores: PronunciationScores = {
                  accuracyScore: parsed.PronunciationAssessment.AccuracyScore,
                  fluencyScore: parsed.PronunciationAssessment.FluencyScore,
                  completenessScore: parsed.PronunciationAssessment.CompletenessScore,
                  pronunciationScore: parsed.PronunciationAssessment.PronScore,
                  text: result.text,
                  words: parsed.PronunciationAssessment.Words || [],
                  error: undefined
                };
                resolve(scores);
              } else {
                // Even without pronunciation scores, return the recognized text
                resolve({
                  text: result.text,
                  error: undefined
                });
              }
            } catch (err) {
              console.error("Azure response parse error:", err);
              // Return at least the recognized text if parsing fails
              resolve({
                text: result.text,
                error: (err as Error).message
              });
            } finally {
              recognizer.close();
            }
          },
          err => {
            recognizer.close();
            console.error("Azure recognizer error:", err);
            reject("Azure recognizer error: " + err);
          }
        );
      } catch (err) {
        console.error("Blob/audio setup error:", err);
        reject("Audio setup failed: " + (err as Error).message);
      }
    }).catch(err => {
      reject("Failed to read audio blob: " + err);
    });
  });
}