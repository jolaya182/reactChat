/**
 * @title: webpack.config.js
 * @author: Javier Olaya
 * @date: 8/19/2021
 * @description: main webpack config file for the card application
 */
const path = require('path');

const dist = path.resolve(__dirname, '../dist');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './frontend/src/index.jsx',
  output: {
    filename: 'bundle.js',
    path: dist,
    assetModuleFilename: 'image/[hash][ext][query]'
  },
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: './frontend/src/index.html',
      favicon: './frontend/images/jLogo.ico'
    }),
  ],

  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader, options: { publicPath: '' } },
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)/i,
        type: 'asset'
      }
    ]
  },
  resolve: { extensions: ['.js', '.jsx'] }
};
