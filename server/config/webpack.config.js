'use strict'
const path = require('path')

var DIST_DIR = path.resolve(__dirname, "dist");
var SRC_DIR = path.resolve(__dirname, "src");

const config = {
    entry: __dirname + '\\..\\..' + '\\src\\app\\index.js',
    output: {
      path: __dirname + "../../../dist/app",
      filename: "bundle.js"
    },
    resolve: {
      extensions: ['.jsx', '.js', '.json']
    },
    module: {
        rules: [
            { test: /\.jsx?$/, loader: 'babel-loader' }
        ]
    }
}
module.exports = config
