const express = require('express');
const connnectDB = require('./config/db');
const app = express();
const path = require('path');
connnectDB();
app.use(express.json({ extended: false }));
app.get('/', (req, res) => res.send('API running'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/post'));
app.use('/api/auth', require('./routes/api/auth'));

//serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port${PORT}`));
