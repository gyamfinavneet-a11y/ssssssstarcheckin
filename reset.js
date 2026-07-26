const { redisGet, redisSet, getRedisConfig } = require("./_redis");
const { INITIAL_MEMBERS } = require("./_members");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const { url, token } = getRedisConfig();
    if (!url || !token) {
      return res.status(200).json({ success: true, members: INITIAL_MEMBERS, batchId: "1" });
    }
    let raw = await redisGet("members");
    if (!raw) {
      raw = JSON.stringify(INITIAL_MEMBERS);
      await redisSet("members", raw);
    }
    let batchId = await redisGet("batchId");
    if (!batchId) {
      batchId = "1";
      await redisSet("batchId", batchId);
    }
    return res.status(200).json({ success: true, members: JSON.parse(raw), batchId: batchId });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
