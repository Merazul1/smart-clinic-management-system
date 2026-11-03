let app: any;
try {
  const dist = require('../backend/dist/server');
  app = dist.default || dist.app || dist;
} catch (e) {
  const src = require('../backend/src/server');
  app = src.default || src.app || src;
}

export default app;
