import express from 'express';
import cors from 'cors';
import handleSignIn from './controllers/signin.js';
import handleRegister from './controllers/register.js';
import handleProfile from './controllers/profile.js';
import handleApiCall from './controllers/api.js';
import handleImage from './controllers/image.js';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.post('/signin', handleSignIn);
app.post('/register', handleRegister);
app.get('/profile/:id', handleProfile);
app.post('/api', handleApiCall);
app.put('/image', handleImage);

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
