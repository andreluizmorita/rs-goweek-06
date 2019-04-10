const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());

const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
  console.log('ok');

  socket.on('connectRoom', box => {
    socket.join(box);
  });
});

mongoose.connect(
  'mongodb+srv://goweek06:goweek06@cluster0-exb7x.mongodb.net/test?retryWrites=true',
  {
    useNewUrlParser: true
  }
);

app.use((req, res, next) => {
  req.io = io;

  return next();
});

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));
app.use(require('./routes'));

app.listen(process.env.PORT || 3333);
