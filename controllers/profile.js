import db from '../config/db.js';

const handleProfile = (req, res) => {
  const { id } = req.params;
  db('users')
    .select('*').where({ id })
    .then(user => {
      user.length
        ? res.json(user[0])
        : res.status(404).json('error getting user')
    })
    .catch(err => res.status(500).json('internal server error'))
}

export default handleProfile;
