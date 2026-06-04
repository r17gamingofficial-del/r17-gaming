import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function createDevApiResponse(res) {
  res.status = (statusCode) => {
    res.statusCode = statusCode;
    return res;
  };
  res.json = (payload) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
  };
  return res;
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on('data', (chunk) => chunks.push(chunk));
    req.on('error', reject);
    req.on('end', () => {
      const rawBody = Buffer.concat(chunks).toString('utf8');
      if (!rawBody) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(rawBody));
      } catch {
        reject(new Error('Invalid JSON request body'));
      }
    });
  });
}

function devApiRoute(loadHandler) {
  return async (req, res) => {
    try {
      req.body = await readJsonBody(req);
      const handler = await loadHandler();
      await handler.default(req, createDevApiResponse(res));
    } catch (error) {
      createDevApiResponse(res).status(500).json({
        error: error?.message || 'Unable to process request',
      });
    }
  };
}

function r17DevApiPlugin() {
  return {
    name: 'r17-dev-api',
    configureServer(server) {
      server.middlewares.use(
        '/create-order',
        devApiRoute(() => import('./api/create-order.js')),
      );
      server.middlewares.use(
        '/verify-payment',
        devApiRoute(() => import('./api/verify-payment.js')),
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env.RAZORPAY_KEY_ID ||= env.RAZORPAY_KEY_ID;
  process.env.RAZORPAY_KEY_SECRET ||= env.RAZORPAY_KEY_SECRET;

  return {
    plugins: [react(), r17DevApiPlugin()],
  };
})
