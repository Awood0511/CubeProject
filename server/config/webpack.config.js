var path = require("path");

var config = {
    entry: __dirname + "\\..\\.." + "\\src\\app\\index.js",
    output: {
        path: __dirname + "../../../dist/app",
        filename: "bundle.js",
        publicPath: "/app/"
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: {
                  presets: ['@babel/react', '@babel/env'],
                  plugins: ['@babel/plugin-proposal-class-properties']
                }
            }
        ]
    }
};

module.exports = config;
