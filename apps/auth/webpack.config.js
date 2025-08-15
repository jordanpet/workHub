const { join } = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('../../webpack.app.config');

module.exports = merge(commonConfig, {
  output: {
    path: join(__dirname, '../../dist/apps/auth'),
  },
  externals: {
    '@workhub/grpc': 'commonjs @workhub/grpc',
    '@workhub/graphql': 'commonjs @workhub/graphql',
    '@workhub/prisma': 'commonjs @workhub/prisma',
    '@workhub/nestjs': 'commonjs @workhub/nestjs',
    '@workhub/pulsar': 'commonjs @workhub/pulsar',
  },
});
