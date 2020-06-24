module.exports = {
  pageExtensions: ['page.tsx'],
  webpack: (config, { webpack }) => {
    config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//));
    return config;
  }
};
