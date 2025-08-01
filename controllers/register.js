import bcrypt from 'bcrypt-nodejs';
import db from '../config/db.js';

const handleRegister = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json('incorrect form submission')
  }
  const hash = bcrypt.hashSync(password);

  db.transaction(trx => {
    return trx('login')
      .insert({
        hash: hash,
        email: email
      })
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .insert({
            name,
            email: loginEmail[0].email,
            joined: new Date()
          })
          .returning('*');
      })
  })
    .then(user => res.json(user[0]))
    .catch(err => res.status(400).json('unable to register'));
};

export default handleRegister;
