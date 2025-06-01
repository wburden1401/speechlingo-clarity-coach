type AzureAssessment = {
    AccuracyScore: number;
    FluencyScore: number;
    CompletenessScore: number;
  };
  
  export function parseAzureFeedback(assessment: AzureAssessment): string {
    const { AccuracyScore, FluencyScore, CompletenessScore } = assessment;
  
    const feedback: string[] = [];
  
    // Accuracy
    if (AccuracyScore >= 90) {
      feedback.push("Your pronunciation was excellent, with clear and accurate speech.");
    } else if (AccuracyScore >= 75) {
      feedback.push("Your pronunciation was good overall, but a few words could be clearer.");
    } else {
      feedback.push("Work on pronouncing words more clearly. Some words were difficult to understand.");
    }
  
    // Fluency
    if (FluencyScore >= 90) {
      feedback.push("You spoke fluently with natural rhythm and flow.");
    } else if (FluencyScore >= 70) {
      feedback.push("Your fluency was decent, but there were some noticeable pauses or hesitations.");
    } else {
      feedback.push("Try to speak more smoothly and reduce long pauses between words.");
    }
  
    // Completeness
    if (CompletenessScore >= 90) {
      feedback.push("You completed your sentence fully without missing parts.");
    } else if (CompletenessScore >= 70) {
      feedback.push("Some parts of the sentence were missing or skipped.");
    } else {
      feedback.push("You skipped a significant part of the content. Try to speak the full sentence.");
    }
  
    return feedback.join(" ");
  }
  