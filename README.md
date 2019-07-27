# create-react-catchapp

## setup:

`create-react-catchapp` can be setup through `npx` or traditionally through `npm`. If you choose to use the `npm` route then you'll have a better experience adding it as a global package install with `install -g`.

## npx:

```
npx create-react-catchapp app-name
```

## npm:

```
npm install -g create-react-catchapp
create-react-catchapp app-name
```

## git:

```
git clone http://github.com/mariocatch/create-react-catchapp
cd create-react-catchapp
npm start app-name
```

> npx is the peferred way to setup create-react-catchapp

The finished structure of the project will be:

```
app-name
├── node_modules/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
|   |── App.js
|   └── index.js
|── .gitignore
|── package.json
└── webpack.config.dev.js
```

## running the app:

```
cd app-name
npm start
```

## closing:

Honestly this was made because I feel that CRA is too bulky, and hides away some of the most important technologies that web developers should at the very least be familiar with (webpack, babel). If you find it useful, great! If you want to tweak things on your end `.setuprc` is the blueprint that the generated app will base itself off of. Currently you're able to tweak the initial dependencies, npm scripts, eslint config, and babel settings.

I'm open to suggestions and improvements as well. Thanks!

- Twitter: [@mario_catch](https://twitter.com/mario_catch)
- Discord: [trustie#5794](https://discordapp.com/channels/143867839282020352/276477384780152834/472092706978529281)
- GitHub: [mariocatch](https://github.com/mariocatch)
