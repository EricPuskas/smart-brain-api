const jwt = require("jsonwebtoken");
const redis = require("redis");

//setup Redis
const redisClient = redis.createClient(process.env.REDIS_URI);
const handleSignIn = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject("Incorrect Form Submission");
  }
  return db
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then(user => user[0])
          .catch(err => Promise.reject("User not found"));
      } else {
        return Promise.reject("Wrong Credentials");
      }
    })
    .catch(err => Promise.reject("Wrong credentials"));
};

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json("Unauthorized");
    }
    return res.json({ id: reply });
  });
};

const signToken = email => {
  const jwtPayLoad = { email };
  return jwt.sign(jwtPayLoad, process.env.JWT_SECRET, { expiresIn: "2 days" });
};

const setToken = (token, id) => {
  return Promise.resolve(redisClient.set(token, id));
};

const createSession = user => {
  // JWT token, return user data
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: true, userId: id, token };
    })
    .catch(console.log);
};

const handleAuth = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId(req, res)
    : handleSignIn(db, bcrypt, req, res)
        .then(data => {
          return data.id && data.email
            ? createSession(data)
            : Promise.reject("Something went wrong");
        })
        .then(session => res.json(session))
        .catch(err => res.status(400).json(err));
};

module.exports = {
  handleAuth,
  redisClient
};
