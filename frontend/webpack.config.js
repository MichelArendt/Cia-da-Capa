const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.js',    // Entry for the main app
    admin: './src/admin.js',   // Entry for the admin app
  },
  output: {
    path: path.resolve(__dirname, '../build'),  // Output to the build folder
    filename: '[name].[contenthash].bundle.js', // Output filename with chunk name and content hash
    publicPath: '',                             // Use empty string for relative paths
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(js|jsx)$/,    // Include .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.scss$/,        // Include .scss files
        use: [
          'style-loader',       // Inject CSS into the DOM
          'css-loader',         // Translates CSS into CommonJS
          'sass-loader',        // Compiles SCSS to CSS
        ],
      },
    ],
  },
  plugins: [
    // Clean the output directory before each build
    new CleanWebpackPlugin(), // Add the plugin here

    // Plugin for index.html (main app)
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      chunks: ['main'],         // Include only the main chunk
    }),

    // Plugin for admin.html (admin app)
    new HtmlWebpackPlugin({
      template: './public/admin.html',
      filename: 'admin.html',
      chunks: ['admin'],        // Include only the admin chunk
    }),

    // Copy other static assets
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: '.',
          globOptions: {
            ignore: ['**/index.html', '**/admin.html'],  // Exclude HTML files processed by HtmlWebpackPlugin
          },
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],  // Allow imports without specifying extensions
  },
  // Optional: Enable watching for development
  watch: false,
};
