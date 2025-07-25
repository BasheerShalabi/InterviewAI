const analyzeCV = require('../utils/cvAnalyzer');
const {clean} = require('../utils/responseCleaner')
module.exports.uploadCV = async (req, res) => {
  try {
    const result = await analyzeCV(req.file.path);
    const cleaned = clean(result.result)
    const parsed = JSON.parse(cleaned);
    res.json({result:parsed,raw:result.raw});
  } catch (err) {
    console.error('CV Analysis Error:', err.message);
    res.status(500).json({ error: 'CV analysis failed' });
  }
};
