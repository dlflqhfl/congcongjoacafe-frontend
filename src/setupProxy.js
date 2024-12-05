// setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'http://localhost:9090',
      changeOrigin: true,
    }),
  );

//   app.use(
//     createProxyMiddleware('/api/breeds', {
//       target: 'https://dog.ceo',
//       changeOrigin: true,
//     }),
//   );
};