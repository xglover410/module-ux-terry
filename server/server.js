import path from 'path';
import express from 'express';

import fileController from './controllers/fileController.js';

const app = express();


const PORT = 3000;

/**
 * handle parsing request body
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * handle requests for static files
 */
app.use(express.static(path.resolve(import.meta.dirname, 'client')));

/**
 * define route handlers
 */
app.get('/api/characters',
  fileController.getCharacters,
  (req, res) => res.status(200).json({ characters: [...res.locals.characters] }),
  // eslint-disable-next-line function-paren-newline
);

app.post('/api/info',
  fileController.getHomeworldAndFilms,
  (req, res) => res.status(200).json({ ...res.locals.info }),
  // eslint-disable-next-line function-paren-newline
);

// respond with main app
app.get('/', (req, res) => (
  res.status(200).sendFile(path.resolve(import.meta.dirname, '../client/index.html'))
));

/**
 * start server
 */
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

export default app;
