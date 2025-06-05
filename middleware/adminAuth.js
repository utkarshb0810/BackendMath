// Simple mock admin middleware using a token
module.exports = (req, res, next) => {
  const token = req.headers["x-admin-token"];
  if (token === process.env.ADMIN_TOKEN) {
    return next();
  }
  return res.status(403).json({ error: "Unauthorized access" });
};
