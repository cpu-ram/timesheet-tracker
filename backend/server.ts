import dotenv from 'dotenv';
import app from './src/index.js';
import './src/config/passportConfig.js';

dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
