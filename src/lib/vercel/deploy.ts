import { logEnv } from './prepare';
import path from 'path';
import { getEnv } from './helpers';
import { VercelManager } from './manager';

export async function deployToVercel() {
  if (['prod', 'dev'].includes(process.env.DEPLOY_ENV || '')) {
    const srcDir = path.basename(path.join(__dirname, '../../../../'));

    const env = process.env.DEPLOY_ENV;
    
    // VercelManager for webhook project
    const manager = new VercelManager({ 
      name: srcDir,
      functions: {
        'src/app/api/**/*.ts': {
          memory: 512,
          maxDuration: 60,
        },
      }
    });
    
    logEnv();

    const parsed = getEnv();
    await manager.deployToVercel(`ikas-webhook-listener-${env}`, [], parsed);
  }
}

deployToVercel(); 