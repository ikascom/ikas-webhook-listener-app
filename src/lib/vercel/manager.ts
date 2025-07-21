import axios from 'axios';
import path from 'path';

type BuilderFunctions = {
  [p: string]: {
    memory: number;
    maxDuration: number;
  };
};

export class VercelManager {
  srcDir: string;
  name: string;
  libs?: string[];
  common: { vercel: { authToken: string; teamId: string; region: string } };
  functions: BuilderFunctions;

  constructor({ name, functions, libs }: { name: string; functions?: BuilderFunctions; libs?: string[] }) {
    this.srcDir = path.resolve(path.join(__dirname, '../../../'));
    this.name = name;
    this.libs = libs;
    this.common = {
      vercel: {
        authToken: process.env.VERCEL_AUTH_TOKEN || '',
        teamId: process.env.VERCEL_TEAM_ID || '',
        region: process.env.VERCEL_REGION || 'fra1',
      },
    };

    this.functions = functions || {
      'src/pages/api/**/*.ts': {
        memory: 512,
        maxDuration: 60,
      },
    };
  }

  async setAliasToVercelProject(alias: string, projectId: string, redirect?: string) {
    try {
      const options = {
        headers: {
          Authorization: `Bearer ${this.common.vercel.authToken}`,
          'Content-Type': 'application/json',
        },
      };

      const aliasUrl = `https://api.vercel.com/v1/projects/${projectId}/alias?teamId=${this.common.vercel.teamId}`;
      const data: { redirect: string | undefined; domain: string } = { domain: alias, redirect: undefined };
      if (redirect) {
        data['redirect'] = redirect;
      }
      await axios.post(aliasUrl, data, options);
    } catch (e) {
      console.log(alias + ' alias is already exists');
    }
  }

  async createVercelProject(name: string, aliasList: any[]) {
    try {
      const options = {
        headers: {
          Authorization: `Bearer ${this.common.vercel.authToken}`,
          'Content-Type': 'application/json',
        },
      };

      const ensureUrl = `https://api.vercel.com/v1/projects/ensure-project?teamId=${this.common.vercel.teamId}`;
      const res = await axios.post(ensureUrl, { name }, options);
      const projectId = res.data.id;

      const updateUrl = `https://api.vercel.com/v2/projects/${name}?teamId=${this.common.vercel.teamId}`;
      await axios.patch(updateUrl, { framework: 'nextjs' }, options);

      for (const al of aliasList) {
        try {
          await this.setAliasToVercelProject(al.alias, projectId, al.redirect);
        } catch (e) {
          console.log(e);
        }
      }
    } catch (err) {
      throw `Error create vercel project: ${err}`;
    }
  }

  async createBuildFolder() {
    const fs = require('fs');
    const { execSync } = require('child_process');
    const rootDir = path.join(__dirname, '../../..');
    const buildDir = path.join(rootDir, 'build');

    if (fs.existsSync(buildDir)) {
      fs.rmSync(buildDir, { recursive: true });
    }

    fs.mkdirSync(buildDir);

    // Copy only essential files for deployment
    const filesToCopy = ['package.json', 'pnpm-lock.yaml', 'next.config.js', '.env.production', 'tsconfig.json', 'src', 'public', 'app'];

    for (const file of filesToCopy) {
      const sourcePath = path.join(rootDir, file);
      const targetPath = path.join(buildDir, file);

      if (fs.existsSync(sourcePath)) {
        if (fs.statSync(sourcePath).isDirectory()) {
          // Copy directory
          execSync(`cp -r "${sourcePath}" "${targetPath}"`);
        } else {
          // Copy file
          execSync(`cp "${sourcePath}" "${targetPath}"`);
        }
      }
    }

    return buildDir;
  }

  async deployToVercel(name: string, aliasList: any[] = [], env?: any) {
    const fs = require('fs');
    const { createDeployment } = require('@vercel/client');
    try {
      let deployment;
      await this.createVercelProject(name, aliasList);
      console.log('vercel project created');

      const buildDir = await this.createBuildFolder();
      console.log('build folder created');

      for await (const event of createDeployment(
        {
          token: this.common.vercel.authToken,
          path: buildDir,
          isDirectory: true,
          teamId: this.common.vercel.teamId,
          withCache: false,
        },
        {
          name: name,
          target: 'production',
          functions: this.functions,
          projectSettings: {
            buildCommand: `pnpm build`,
            outputDirectory: `.next`,
            framework: 'nextjs',
          },
          env,
        },
        {
          projectSettings: {
            framework: 'nextjs',
          },
          regions: [this.common.vercel.region],
        },
      )) {
        if (event.type === 'ready') {
          deployment = event.payload;
          if (deployment.status == 'READY') {
            console.log('Deploy Success');
          } else {
            console.log(`Failed vercel deploy`);
            throw 'Failed';
          }

          break;
        } else if (event.type === 'error') {
          console.log(event);
        } else {
          console.log(event.type);
        }
      }

      if (fs.existsSync(buildDir)) {
        fs.rmSync(buildDir, { recursive: true });
      }

      const nextDir = path.join(__dirname, '../../../../.next');
      if (fs.existsSync(nextDir)) {
        fs.rmdirSync(nextDir, { recursive: true });
      }

      return deployment;
    } catch (err) {
      console.error(err);
      throw `Failed vercel deploy: ${err}`;
    }
  }
}
