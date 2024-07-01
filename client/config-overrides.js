const { override } = require('customize-cra');
const webpack = require('webpack');

module.exports = override((config) => {
  // Define aliases for polyfills or specific modules
  config.resolve.alias = {
    ...config.resolve.alias,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify'),
    url: require.resolve('url'),
  };

  // Add webpack plugins such as ProvidePlugin
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  );

  return config;
});
