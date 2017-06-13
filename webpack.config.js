const path = require('path');

const pkg = require('./package.json');

module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'index.js',
    library: 'redux-listview',
    libraryTarget: 'umd'
  },
  module: {
    rules: [{
      test: /\.js?$/,
      use: ['babel-loader'],
      exclude: /node_modules/,
      include: path.resolve(__dirname, "src")
    }]
  },
  externals: Object.keys(pkg.peerDependencies)
};
