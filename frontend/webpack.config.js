const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const crypto = require('crypto');

const buildPath = path.resolve(__dirname, '../build'); // Build directory
const uniqueHash = crypto.randomBytes(8).toString('hex'); // Unique hash for file naming

// Set deployment-specific paths based on the ENVIRONMENT variable
const deploymentPublicPaths = {
  local: '/build/',
  deploytest: '/testing/',
  production: '/'
};

module.exports = (_, argv) => {
  const environment = process.env.ENVIRONMENT || '/'; // Default to 'local' if not specified
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.js',
    output: {
      path: buildPath,
      filename: `[name].${uniqueHash}.bundle.js`, // Output all bundles to 'build/' directory
      publicPath: deploymentPublicPaths[environment] || '/', // Use environment-specific path or default to '/'
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
          test: /\.(css|scss)$/, // Match both .css and .scss files
          use: [
            'style-loader',  // Injects styles into the DOM
            'css-loader',    // Translates CSS into CommonJS
            'sass-loader',   // Compiles SCSS to CSS (only applies to .scss files)
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
            to: buildPath, // Destination in /build
            globOptions: {
              ignore: ['**/index.html'],  // Exclude index.html
            },
            noErrorOnMissing: true, // Ignores if 'public' has missing files
          },
        ],
      }),
    ],
  }
};
