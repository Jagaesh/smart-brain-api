import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    },
  ]
}

app.get('/', (req, res) => {
  res.send(database.users);
})

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  const user = database.users.find(user => user.email === email && user.password === password);
  if (user) {
    res.json('success');
  } else {
    res.status(401).json('error logging in');
  }
})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  database.users.push(
    {
      id: '125',
      name: name,
      email: email,
      password: password,
      entries: 0,
      joined: new Date()
    }
  );
  res.json(database.users[database.users.length - 1]);
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params
  const user = database.users.find(user => user.id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json('user not found');
  }
})

app.put('/image/:id', (req, res) => {
  const { id } = req.params
  const user = database.users.find(user => user.id === id);
  if (user) {
    user.entries++;
    res.json(user.entries);
  } else {
    res.status(404).json('user not found');
  }
})

app.listen(3000, () => {
  console.log('app is running on port 3000');
})


// bcrypt.hash("bacon", null, null, function (err, hash) {
//   // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function (err, res) {
//   // res == true
// });
// bcrypt.compare("veggies", hash, function (err, res) {
//   // res = false
// });