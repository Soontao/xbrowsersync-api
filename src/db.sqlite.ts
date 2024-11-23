import sqlite3 from 'better-sqlite3';
import * as Config from './config';

export const connect = async (path?: string) => {
  if (connect.db == null) {
    const db = (connect.db = sqlite3(Config.get().db.sqlitePath ?? path ?? './db.sqlite'));
    db.pragma('journal_mode = WAL');
    db.exec(
      'CREATE TABLE IF NOT EXISTS `Documents` (`type` TEXT NOT NULL, `id` TEXT NOT NULL, `content` TEXT NOT NULL, PRIMARY KEY(`type`, `id`));'
    );
    global.db = connect.db;
  }
  return connect.db;
};

connect.db = null as sqlite3.Database;

export const disconnect = async () => {
  connect.db?.close();
};
