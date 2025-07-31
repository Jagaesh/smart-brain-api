import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt-nodejs';
import db from './config/db.js';
import { CLARIFAI, buildClarifaiRequestOptions } from './config/clarifaiConfig.js';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/clarifai', (req, res) => {
  const { imageUrl } = req.body;
  const clarifaiUrl = `https://api.clarifai.com/v2/models/${CLARIFAI.MODEL_ID}/versions/${CLARIFAI.MODEL_VERSION_ID}/outputs`;
  const requestOptions = buildClarifaiRequestOptions(imageUrl);

  fetch(clarifaiUrl, requestOptions)
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(err => res.status(400).json('Unable to work with Clarifai API'));
});

app.get('/', (req, res) => {
  db('users')
    .select('*')
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(404).json('unable to register')
    });
})

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
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
        .then(user => {
          res.json(user[0])
        })
        .catch(err => {
          res.status(404).json('unable to get user')
        })
    })
    .catch(err => {
      res.status(500).json('internal server error')
    })
})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
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
    .then(user => {
      res.json(user[0])
    })
    .catch(err => {
      res.status(400).json('unable to register')
    });
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db('users')
    .select('*').where({ id })
    .then(user => {
      user.length
        ? res.json(user[0])
        : res.status(404).json('error getting user')
    })
    .catch(err =>
      res.status(500).json('internal server error')
    )
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users')
    .where({ id })
    .increment('entries', 1)
    .returning('*')
    .then(entries => {
      res.json(entries[0].entries)
    })
    .catch(err =>
      res.status(404).json('unable to get entries count')
    )
})

app.listen(3000, () => {
  console.log('app is running on port 3000');
})
