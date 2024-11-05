const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const crypto = require('crypto');
const uniqueHash = crypto.randomBytes(8).toString('hex');

// console.log('Public path:', path.resolve(__dirname, 'public'));
// console.log('Build output path:', path.resolve(__dirname, '../build'))

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: `[name].${uniqueHash}.bundle.js`, // Output all bundles to 'build/' directory
    publicPath: ''
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,        // Include .scss files
        use: [
          'style-loader',       // Inject CSS into the DOM
          'css-loader',         // Translates CSS into CommonJS
          'sass-loader',        // Compiles SCSS to CSS
        ],
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    // Clean the output directory before each build
    new CleanWebpackPlugin(), // Add the plugin here

    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),

    // Copy other static assets
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'), // Source in /frontend/public
          to: path.resolve(__dirname, '../build'), // Destination in /build
          globOptions: {
            ignore: ['**/index.html'],  // Exclude index.html
          },
          noErrorOnMissing: true, // Ignores if 'public' has missing files
        },
      ],
    }),
  ],
  mode: 'development'
};
