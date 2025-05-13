import Sentiment from "sentiment";
import keywords from "./moodKeywords.json";

const sentiment = new Sentiment();

export function detectMood(text) {
  const lower = text.toLowerCase();
  const scores = {};

  // Count keyword matches
  for (const [mood, words] of Object.entries(keywords)) {
    for (const w of words) {
      const re = new RegExp(`\\b${w}\\b`, "g");
      const matches = lower.match(re);
      if (matches) scores[mood] = (scores[mood] || 0) + matches.length;
    }
  }

  // Use sentiment score as backup
  const { score: s } = sentiment.analyze(text);

  if (Object.keys(scores).length === 0) {
    if (s > 1) return "happy";
    if (s < -1) return "sad";
    return "neutral";
  }

  // Return top mood by score
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}
