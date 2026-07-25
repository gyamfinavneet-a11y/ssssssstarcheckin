const { redisGet, redisSet, getRedisConfig } = require("./_redis");
const { INITIAL_MEMBERS } = require("./_members");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ success: false });

  try {
    const { id } = req.body;
    const { url, token } = getRedisConfig();
    if (!url || !token) {
      const m = INITIAL_MEMBERS.find(x => x.id === id);
      return m ? res.status(200).json({ success: true, member: { ...m, checked: true } }) : res.status(404).json({ success: false });
    }
    let raw = await redisGet("members");
    let members = raw ? JSON.parse(raw) : [...INITIAL_MEMBERS];
    const member = members.find(x => x.id === id);
    if (!member) return res.status(404).json({ success: false, message: "成员不存在" });
    if (member.checked) return res.status(200).json({ success: false, message: "该成员已签到" });
    member.checked = true;
    await redisSet("members", JSON.stringify(members));
    return res.status(200).json({ success: true, member });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
