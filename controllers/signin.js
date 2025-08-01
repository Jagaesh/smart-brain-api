import bcrypt from 'bcrypt-nodejs';
import db from '../config/db.js';

const handleSignIn = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }

  db('login')
    .select('hash')
    .where({ email })
    .then(hash => {
      if (!hash.length || !bcrypt.compareSync(password, hash[0].hash)) {
        return res.status(400).json('invalid email or password');
      }
      return db('users')
        .select('*')
        .where({ email })
        .then(user => res.json(user[0]))
        .catch(err => res.status(404).json('unable to get user'));
    })
    .catch(err => res.status(500).json('internal server error'));
};

export default handleSignIn;
