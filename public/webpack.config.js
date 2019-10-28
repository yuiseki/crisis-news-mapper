const path = require('path');
const indexConfig = {
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
    minimize: false
  },
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '')
  }
}
const newsConfig = {
  mode: "development",
  entry: "./src/news.ts",
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
    minimize: false
  },
  output: {
    filename: 'news.js',
    path: path.join(__dirname, '')
  }
}
module.exports = [indexConfig, newsConfig]