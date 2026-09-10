import {DatabaseSync} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import type {Store} from './store';
let store:Store|undefined;
export async function openStore():Promise<Store>{
 if(store)return store;
 const file=process.env.DATABASE_PATH||resolve('.data/chennai.sqlite');
 if(file!==':memory:')mkdirSync(dirname(file),{recursive:true});
 const db=new DatabaseSync(file);db.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');
 store={async all<T>(sql,params=[]){return db.prepare(sql).all(...params) as T[]},async run(sql,params=[]){db.prepare(sql).run(...params)},async batch(statements){db.exec('BEGIN IMMEDIATE');try{for(const {sql,params=[]} of statements)db.prepare(sql).run(...params);db.exec('COMMIT')}catch(error){db.exec('ROLLBACK');throw error}}};
 return store;
}
