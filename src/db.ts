import { Request } from 'express';
import mongoose from 'mongoose';
import process from 'process';
import { LogLevel } from './common/enums';
import * as Config from './config';

// Initialize the database connection using config settings
export const connect = async (
  log?: (level: LogLevel, message: string, req?: Request, err?: Error) => void
): Promise<void> => {
  // Set the db connection options from config settings
  const options: mongoose.ConnectOptions = {
    connectTimeoutMS: Config.get().db.connTimeout,
    ssl: Config.get().db.useSRV || Config.get().db.ssl,
  };

  const host = process.env.XBROWSERSYNC_DB_HOST ?? Config.get().db.host;
  const port = process.env.XBROWSERSYNC_DB_PORT ?? Config.get().db.port;

  // Configure db credentials
  const username = process.env.XBROWSERSYNC_DB_USER ?? Config.get().db.username;
  const password = process.env.XBROWSERSYNC_DB_PWD ?? Config.get().db.password;
  const creds = username && password ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@` : '';

  // Create mongo connection uri using host and db name defined in config settings
  let dbServerUrl: string;

  if (process.env.XBROWSERSYNC_DB_URI !== undefined) {
    dbServerUrl = process.env.XBROWSERSYNC_DB_URI;
  } else {
    dbServerUrl = 'mongodb';
    if (Config.get().db.useSRV) {
      dbServerUrl += `+srv://${creds}${host}/${Config.get().db.name}`;
    } else {
      dbServerUrl += `://${creds}${host}:${port}/${Config.get().db.name}`;
    }
    dbServerUrl += Config.get().db.authSource ? `?authSource=${Config.get().db.authSource}` : '';
  }

  // Connect to the database
  try {
    await mongoose.connect(dbServerUrl, options);
  } catch (err) {
    if ((log ?? undefined) !== undefined) {
      log(LogLevel.Error, 'Unable to connect to database', null, err);
    }
    process.exit(1);
  }
};

// Closes the database connection
export const disconnect = async (): Promise<void> => {
  await mongoose.disconnect();
};
