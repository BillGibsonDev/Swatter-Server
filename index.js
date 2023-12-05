import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import { CronJob } from 'cron';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

import routes from './routes/routes.js';
import { backupProjects } from './controllers/BackupProjectController.js';

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8000;

app.use('/', routes);

mongoose.connect(   
  process.env.NODE_ENV_MONGO_KEY, {
    useNewUrlParser: true,
  }
);

app.listen(port, host, () => {
  console.log(`Server active on ${port}`);
}); 

const backupProjectsJob = new CronJob("0 * * * *", () => {
  backupProjects();
  const date = new Date();
  let dateString = date.toLocaleString();
  console.log(`backup projects started @ ${dateString}`);
},
  null,
  true,
  'America/New_York'
);

backupProjectsJob.start();