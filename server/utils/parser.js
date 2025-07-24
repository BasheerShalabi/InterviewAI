function parseAiFeedback(responseText) {
  try {
    const cleaned = responseText.trim().replace(/^```json/, '').replace(/```$/, '').trim();

    const parsed = JSON.parse(cleaned);

    if (!parsed.feedback || !Array.isArray(parsed.feedback)) return null;
    if (typeof parsed.overallScore  !== 'number') return null;
    if (typeof parsed.finalReview !== 'object') return null;

    return parsed;
  } catch (error) {
    console.error('Failed to parse AI feedback:', error);
    return null;
  }
}

module.exports = parseAiFeedback;
