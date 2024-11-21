const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack');
const LiveReloadPlugin = require('webpack-livereload-plugin'); // Import LiveReloadPlugin
const crypto = require('crypto');

const buildPath = path.resolve(__dirname, '../build'); // Build directory
const uniqueHash = crypto.randomBytes(8).toString('hex'); // Unique hash for file naming

// Set deployment-specific public paths based on the ENVIRONMENT variable
const deploymentPublicPaths = {
  local: '/build/',
  deploytest: '/novo/',
  production: '/'
};

module.exports = (_, argv) => {
  const environment = process.env.ENVIRONMENT || '/'; // Default to root if not specified
  const isProduction = argv.mode === 'production';
  const publicPath = deploymentPublicPaths[environment] || '/';

  return {
    devtool: isProduction ? 'source-map' : 'eval-source-map', // Use source maps based on mode
    entry: './src/index.js',
    output: {
      path: buildPath,
      filename: `[name].${uniqueHash}.bundle.js`, // Output all bundles to 'build/' directory
      // publicPath: deploymentPublicPaths[environment] || '/', // Use environment-specific path or default to '/'
      publicPath: publicPath,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
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
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    plugins: [
      // Define the PUBLIC_URL environment variable
      new DefinePlugin({
        'process.env.PUBLIC_URL': JSON.stringify(publicPath),
      }),

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

      // Only add LiveReloadPlugin in development mode
      !isProduction && new LiveReloadPlugin({
        protocol: 'http',      // Set to 'http' to match Apache's protocol
        port: 35729,           // Change this port if needed
        appendScriptTag: true, // Inject the LiveReload script automatically
      }),
    ].filter(Boolean), // Filter out LiveReloadPlugin in production mode
  }
};
