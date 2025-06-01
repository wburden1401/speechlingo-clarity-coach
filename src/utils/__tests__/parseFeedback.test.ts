import { describe, it, expect } from 'vitest';
import { parseFeedback } from '../parseFeedback';

describe('parseFeedback', () => {
  it('should parse valid AI feedback JSON', () => {
    const mockAIResponse = JSON.stringify({
      tone: "Your tone was confident and clear",
      filler: "Minimal use of filler words",
      pacing: "Good pace at 130 WPM",
      score: 85,
      scoreExplanation: "Strong delivery with clear articulation, though could improve on pacing"
    });

    const result = parseFeedback(mockAIResponse);

    expect(result).toEqual({
      tone: "Your tone was confident and clear",
      filler: "Minimal use of filler words",
      pacing: "Good pace at 130 WPM",
      score: 85,
      scoreExplanation: "Strong delivery with clear articulation, though could improve on pacing"
    });
  });

  it('should return null for invalid JSON', () => {
    const invalidJSON = "not json";
    const result = parseFeedback(invalidJSON);
    expect(result).toBeNull();
  });

  it('should return null for JSON missing required fields', () => {
    const incompleteJSON = JSON.stringify({
      tone: "Your tone was confident and clear",
      // missing other required fields
    });
    const result = parseFeedback(incompleteJSON);
    expect(result).toBeNull();
  });

  it('should handle empty string input', () => {
    const result = parseFeedback('');
    expect(result).toBeNull();
  });

  it('should handle null or undefined values in JSON', () => {
    const mockResponse = JSON.stringify({
      tone: null,
      filler: undefined,
      pacing: "Good pace",
      score: 85,
      scoreExplanation: "Good overall"
    });
    const result = parseFeedback(mockResponse);
    expect(result).toBeNull();
  });
}); 