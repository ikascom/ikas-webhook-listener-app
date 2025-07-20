import * as dotenv from 'dotenv';
import { devEnv, prodEnv } from './envGlobals';

export function getEnv() {
  const env = process.env.DEPLOY_ENV;
  const envString = env == 'prod' || env == 'production' ? prodEnv : devEnv;
  return dotenv.parse(envString);
}

export function loadEnv() {
  const parsed = getEnv();
  Object.keys(parsed).forEach(function (key) {
    if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
      process.env[key] = parsed[key];
    }
  });
} 