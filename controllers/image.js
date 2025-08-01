import db from '../config/db.js';

const handleImage = (req, res) => {
  const { id } = req.body;
  db('users')
    .where({ id })
    .increment('entries', 1)
    .returning('*')
    .then(entries => res.json(entries[0].entries))
    .catch(err => res.status(404).json('unable to get entries count'))
};

export default handleImage;
