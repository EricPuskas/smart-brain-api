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

const handleProfileUpdate = db => (req, res) => {
  const { id } = req.params;
  const { name, age, pet } = req.body.formInput;
  db("users")
    .where({ id })
    .update({ name })
    .then(response => {
      if (response) {
        res.json("success");
      } else {
        res.status(400).json("Unable to update profile");
      }
    })
    .catch(err => res.status(400).json(err));
};

module.exports = {
  getUserProfile,
  handleProfileUpdate
};
