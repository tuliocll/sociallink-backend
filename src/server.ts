import dotenv from 'dotenv';
dotenv.config();

import app from './app';

app.listen(process.env.SERVER_PORT || 3000);
