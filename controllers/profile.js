const getUserProfile = db => (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(404).json("No user found");
      }
    })
    .catch(err => res.status(404).json(err));
};

module.exports = {
  getUserProfile
};
