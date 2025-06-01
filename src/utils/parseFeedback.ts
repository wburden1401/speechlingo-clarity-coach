interface ParsedFeedback {
  tone: string;
  filler: string;
  pacing: string;
  score: number;
  scoreExplanation: string;
}

export function parseFeedback(aiText: string): ParsedFeedback | null {
  try {
    if (!aiText) return null;
    
    const parsed = JSON.parse(aiText);
    
    // Validate required fields and types
    if (!parsed.tone || typeof parsed.tone !== 'string' ||
        !parsed.filler || typeof parsed.filler !== 'string' ||
        !parsed.pacing || typeof parsed.pacing !== 'string' ||
        typeof parsed.score !== 'number' ||
        !parsed.scoreExplanation || typeof parsed.scoreExplanation !== 'string') {
      return null;
    }
    
    return {
      tone: parsed.tone,
      filler: parsed.filler,
      pacing: parsed.pacing,
      score: parsed.score,
      scoreExplanation: parsed.scoreExplanation
    };
  } catch (e) {
    console.error('Failed to parse AI feedback:', e);
    return null;
  }
} 