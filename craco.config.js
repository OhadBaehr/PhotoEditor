
module.exports = {
  webpack: {
    configure: {
      target: 'electron-renderer'
    }
  },
  eslint: {
    enable: false,
  },
  plugins: [
    {
      plugin: require('craco-less'),
      options: {
        lessLoaderOptions: {
          lessOptions: {

            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
