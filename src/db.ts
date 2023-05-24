import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

sqlite3.verbose()
// you would have to import / invoke this in another file
export async function db (sql: string, params: any) {
  const db = await open({
    filename: './db/stardict.db',
    driver: sqlite3.Database,
    mode: sqlite3.OPEN_READONLY
  })
  try {
    //'SELECT col FROM tbl WHERE 13 = @thirteen ORDER BY col DESC'
    const stmt = await db.prepare(sql);
    await stmt.bind(params);
    //{ '@thirteen': 13 }
    const result = await stmt.all();
    
    //await db.close();
    return result;
  }
  catch(err) {
    console.log("🚀 ~ file: db.ts:22 ~ db ~ err:", err)
    throw err;
  }

}