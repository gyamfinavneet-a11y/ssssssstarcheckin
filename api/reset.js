const { redisSet, getRedisConfig } = require("./_redis");
const { INITIAL_MEMBERS } = require("./_members");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ success: false });

  try {
    const { url, token } = getRedisConfig();
    if (!url || !token) return res.status(200).json({ success: true });
    const reset = INITIAL_MEMBERS.map(m => ({ ...m, checked: false }));
    await redisSet("members", JSON.stringify(reset));
    const newBatchId = String(Date.now());
    await redisSet("batchId", newBatchId);
    return res.status(200).json({ success: true, batchId: newBatchId });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
};
