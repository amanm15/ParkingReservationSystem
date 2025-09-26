import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function initDb() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });
  
  // Create table if not exists
  await db.exec(`CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    licensePlate TEXT NOT NULL,
    spotNumber INTEGER NOT NULL,
    date TEXT NOT NULL
  )`);
  
  return db;
}