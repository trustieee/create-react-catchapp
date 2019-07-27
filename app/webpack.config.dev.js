const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

process.env.NODE_ENV = 'development';

module.exports = {
  mode: 'development',
  target: 'web', // could be node if we were using webpack to bundle node instead of for the browser
  devtool: 'cheap-module-source-map', // let us see original code in the browser, this one is good for dev
  entry: './src/index.js', // can ommit .js, also this is the default so we could leave it out
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/', // this specifies public url of output directory in browser
    filename: 'bundle.js' // html will reference this bundle from memory
  },
  devServer: {
    // could be express as well
    stats: 'minimal', // quiet command line stats
    overlay: true, // overlay errors in the browser
    historyApiFallback: true, // all requests will be sent to index.html - lets react router handle all changes
    open: true,
    // these 3 here are for an open issue in webpack when using chrome
    disableHostCheck: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    https: false
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // where our html template is
      favicon: './public/favicon.ico'
    })
  ],
  // what files we want webpack to handle
  module: {
    rules: [
      {
        // handle the following files from the app
        test: /\.(js)$/,
        // but dont include these
        exclude: /node_modules/,
        // use this when handling the files
        use: ['babel-loader', 'eslint-loader']
      },
      {
        test: /\.(css)$/,
        // combination allows us to import css and webpack will bundle it all into a single file
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
