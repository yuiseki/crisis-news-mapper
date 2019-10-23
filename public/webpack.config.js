const path = require('path');
module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts"]
  },
  optimization: {
    minimize: false,
  },
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '')
  }
};