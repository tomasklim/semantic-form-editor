module.exports = {
  pageExtensions: ['page.tsx'],
  webpack: (config, { webpack }) => {
    config.plugins.push(new webpack.IgnorePlugin(/\/__tests__|__mock__\//));

    config.module.rules.push({
      test: /\.ttl/,
      loader: 'raw-loader'
    });

    return config;
  }
};
