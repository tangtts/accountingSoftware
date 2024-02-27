import { join } from 'path'
import * as yaml from 'js-yaml';
import * as fs from 'fs';

const configFileNameObj = {
  development: 'dev',
  production: 'prod'
}

const env = process.env.NODE_ENV;
let mergedConfig: Record<string, any> = {};


export default () => {
  const configs = ['./default.yaml', `./${configFileNameObj[env]}.yaml`];
  configs.reduce((prev, cur) => {
    return Object.assign(prev, yaml.load(loadYamlFile(cur)))
  }, mergedConfig)
  return mergedConfig
}

function loadYamlFile(file: string) {
  return fs.readFileSync(join(__dirname, file), 'utf-8');
}