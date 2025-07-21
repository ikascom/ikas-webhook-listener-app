import { devEnv, prodEnv } from './envGlobals';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

export function logEnv() {
  console.log('Setting env for', process.env.NEXT_PUBLIC_DEPLOY_URL);
}

export function copyEnv() {
  const srcDir = path.join(__dirname, '../../../');
  const env = process.env.DEPLOY_ENV;
  const envString = env == 'production' || env == 'prod' ? prodEnv : devEnv;
  fs.writeFileSync(`${srcDir}/.env.production`, envString);
}

copyEnv();
dotenv.config({
  path: path.resolve(__dirname, '../../../.env.production'),
});
console.log('ready'); 