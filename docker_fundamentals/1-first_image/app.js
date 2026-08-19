const express = require('express');
const app = express();
const PORT = 3000;

const name = process.env.GREETING_NAME || 'stranger';

app.get('/', (req, res) => {
  res.send(`Hello, ${name}! This message comes from inside a container.\n`);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`GREETING_NAME is set to: ${name}`);
});