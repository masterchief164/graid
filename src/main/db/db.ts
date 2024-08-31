import { Level } from 'level';

// Create or open a LevelDB store
const db = new Level<string, any>('my-db', { valueEncoding: 'json', keyEncoding: 'utf8' });

export const getDb = () => db;
