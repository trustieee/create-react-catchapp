#!/usr/bin/env node

const spawn = require('cross-spawn');
const fs = require('fs');
const path = require('path');
const packageJson = require('./package.json');

const BUILD_DIR = path.join(__dirname, '..');
const PROJECT_NAME = packageJson.name;
const BUILD_PROJECT_DIR = path.join(BUILD_DIR, PROJECT_NAME);
const APP_BASE_DIR = path.resolve('./');

const TEMPLATE_NAME = 'app';
const TEMPLATE_PATH = path.join(BUILD_PROJECT_DIR, TEMPLATE_NAME);

const SETUP_RC_PATH = path.resolve(BUILD_PROJECT_DIR, '.setuprc');

const setuprc = JSON.parse(fs.readFileSync(SETUP_RC_PATH));

const [APP_NAME] = process.argv.slice(2);
if (!APP_NAME) {
  console.log(
    'unable to find app name. please use parameter after package name.'
  );
  process.exit();
}

console.log(`creating ${APP_NAME}`);
const NEW_APP_PATH = path.join(APP_BASE_DIR, APP_NAME);

if (fs.existsSync(NEW_APP_PATH)) {
  console.log('found existing app path');
  var deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file, index) {
        var curPath = path + '/' + file;
        if (fs.lstatSync(curPath).isDirectory()) {
          // recurse
          deleteFolderRecursive(curPath);
        } else {
          // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };
  deleteFolderRecursive(NEW_APP_PATH);
  console.log('deleted existing app path');
}
fs.mkdirSync(NEW_APP_PATH);

console.log('changing cwd');
process.chdir(NEW_APP_PATH);

console.log('creating project');
spawn.sync('npm', ['init', '-y'], { stdio: 'inherit' });

console.log('creating git repo');
spawn.sync('git', ['init', '.']);

const NEW_PACKAGE_JSON_PATH = path.join(NEW_APP_PATH, 'package.json');
console.log(NEW_PACKAGE_JSON_PATH);

console.log('injecting package.json changes');
let newPackageJson = JSON.parse(fs.readFileSync(NEW_PACKAGE_JSON_PATH));

newPackageJson.scripts = setuprc.scripts;
newPackageJson.eslintConfig = setuprc.eslintConfig;
newPackageJson.babel = setuprc.babel;

fs.writeFileSync(NEW_PACKAGE_JSON_PATH, JSON.stringify(newPackageJson));

console.log('copying app template');
spawn.sync('cp', ['-a', TEMPLATE_PATH + '/.', NEW_APP_PATH], {
  stdio: 'inherit'
});

// .gitignore didn't copy from template (i removed it from the repo afterwards)
//  so we'll just make it manually here
if (!fs.existsSync(path.join(NEW_APP_PATH, '.gitignore'))) {
  console.log('writing .gitignore');
  fs.writeFileSync(
    path.join(NEW_APP_PATH, '.gitignore'),
    ['node_modules', 'package-lock.json'].join('\n')
  );
}

console.log('copying app template');
spawn.sync('cp', ['-a', TEMPLATE_PATH + '/.', NEW_APP_PATH], {
  stdio: 'inherit'
});

const { devDependencies, dependencies } = setuprc;

console.log('installing dev dependencies');
const dev = new Promise(resolve => {
  const p = spawn('npm install --save-dev', devDependencies, {
    stdio: 'inherit'
  });
  p.on('exit', () => resolve());
});

console.log('installing dependencies');
const dep = new Promise(resolve => {
  const p = spawn('npm install --save', dependencies, {
    stdio: 'inherit'
  });
  p.on('exit', () => resolve());
});

Promise.all([dev, dep]).then(() => {
  console.log("all done! cd '" + APP_NAME + "' && 'npm start' to start it up");
});
