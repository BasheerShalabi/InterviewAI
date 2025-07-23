const analyzeCV = require('../utils/cvAnalyzer');

module.exports.uploadCV = async (req, res) => {
  try {
    const result = await analyzeCV(req.file.path);
    const cleaned = result.result.trim().replace(/^```json/, '').replace(/```$/, '').trim();
    const parsed = JSON.parse(cleaned);
    res.json({result:parsed,raw:result.raw});
  } catch (err) {
    console.error('CV Analysis Error:', err.message);
    res.status(500).json({ error: 'CV analysis failed' });
  }
};
