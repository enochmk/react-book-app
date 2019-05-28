const express = require('express');
const cors = require('cors');
const books = require('./routes/books');

const app = express();

app.use(cors());

// Handle books routes
app.use('/books', books);

// Home page
app.get('/', (req, res) => res.send('Hello World'));

// start servers
PORT = 5000 || process.env.PORT;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
