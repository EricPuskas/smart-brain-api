const redis = require("redis");

//setup Redis
const redisClient = redis.createClient(process.env.REDIS_URI);

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json("Unauthorized");
  }
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json("Unauthorized");
    }
    console.log("Passed");
    return next();
  });
};

module.exports = {
  requireAuth
};
