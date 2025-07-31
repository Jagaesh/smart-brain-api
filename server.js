import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt-nodejs';
import knex from 'knex';

const router = express.Router();

// Your PAT (Personal Access Token) can be found in the Account's Security section
const PAT = 'dd8d4919a3c048f68411e5d7d2f0ef09';
// Specify the correct user_id/app_id pairings
const USER_ID = 'jagaesh';
const APP_ID = 'smartbrain-face-detection';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';
const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

const buildClarifaiRequestOptions = (imageUrl) => {
  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": imageUrl
          }
        }
      }
    ]
  });

  return ({
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
    },
    body: raw
  });
}

router.post('/clarifai', (req, res) => {
  const { imageUrl } = req.body;
  const clarifaiUrl = `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`;
  const requestOptions = buildClarifaiRequestOptions(imageUrl);

  fetch(clarifaiUrl, requestOptions)
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(err => res.status(400).json('Unable to work with Clarifai API'));
});

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'jagaesh',
    password: 'test',
    database: 'smart-brain'
  }
});


const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', router);

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
