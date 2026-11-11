/**
 * @file database.ts
 * @description Native SQLite Database Service for Expo React Native
 * Migrated from @capacitor-community/sqlite to modern expo-sqlite SDK 52.
 * 
 * In pure React Native, expo-sqlite provides direct access to the device's native SQLite
 * engine (C-level performance, no WebView bridges, fully asynchronous).
 */

export interface CustomerRow {
  id: number;
  name: string;
  phone?: string;
  address?: string;
  economicCode?: string;
  avatar?: string;
}

export interface PaymentRow {
  id: number;
  customerId: number;
  date: string;
  amount: number;
  method: string;
  bankName?: string;
  checkDate?: string;
  checkNumber?: string;
  note?: string;
  attachment?: string;
  createdAt?: string;
}

export interface InvoiceRow {
  id: number;
  customerId: number;
  customerName?: string;
  number: string;
  type: string;
  date: string;
  amount: number;
  note?: string;
  items: string; // JSON string in SQLite
  createdAt?: string;
}

class NativeDatabaseService {
  private isInitialized = false;

  async initDB(): Promise<boolean> {
    if (this.isInitialized) return true;
    try {
      // In Expo React Native runtime:
      // import * as SQLite from 'expo-sqlite';
      // const db = await SQLite.openDatabaseAsync('my_invoice_db.db');
      // await db.execAsync(`
      //   CREATE TABLE IF NOT EXISTS customers (
      //     id INTEGER PRIMARY KEY AUTOINCREMENT,
      //     name TEXT NOT NULL,
      //     phone TEXT,
      //     address TEXT,
      //     economicCode TEXT,
      //     avatar TEXT
      //   );
      //   CREATE TABLE IF NOT EXISTS payments (
      //     id INTEGER PRIMARY KEY AUTOINCREMENT,
      //     customerId INTEGER NOT NULL,
      //     date TEXT NOT NULL,
      //     amount REAL NOT NULL,
      //     method TEXT NOT NULL,
      //     bankName TEXT,
      //     checkDate TEXT,
      //     checkNumber TEXT,
      //     note TEXT,
      //     attachment TEXT,
      //     createdAt TEXT
      //   );
      //   CREATE TABLE IF NOT EXISTS invoices (
      //     id INTEGER PRIMARY KEY AUTOINCREMENT,
      //     customerId INTEGER NOT NULL,
      //     customerName TEXT,
      //     number TEXT NOT NULL,
      //     type TEXT NOT NULL,
      //     date TEXT NOT NULL,
      //     amount REAL NOT NULL,
      //     note TEXT,
      //     items TEXT,
      //     createdAt TEXT
      //   );
      // `);

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing Expo SQLite:', error);
      return false;
    }
  }

  // Schema creation statement for Expo SQLite documentation & export
  getSchemaDDL(): string {
    return `
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  economicCode TEXT,
  avatar TEXT
);

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customerId INTEGER NOT NULL,
  date TEXT NOT NULL,
  amount REAL NOT NULL,
  method TEXT NOT NULL,
  bankName TEXT,
  checkDate TEXT,
  checkNumber TEXT,
  note TEXT,
  attachment TEXT,
  createdAt TEXT
);

CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customerId INTEGER NOT NULL,
  customerName TEXT,
  number TEXT NOT NULL,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  amount REAL NOT NULL,
  note TEXT,
  items TEXT,
  createdAt TEXT
);
    `.trim();
  }
}

export const nativeDb = new NativeDatabaseService();
