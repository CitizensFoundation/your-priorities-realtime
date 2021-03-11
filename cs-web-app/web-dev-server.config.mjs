import { fromRollup } from '@web/dev-server-rollup';
import rollupCommonjs from '@rollup/plugin-commonjs';
import proxy from 'koa-proxies';

const commonjs = fromRollup(rollupCommonjs);

export default {
  mimeTypes: {
    '**/*.cjs': 'js'
  },
  port: 9000,
  middleware: [
    proxy('/api/', {
      target: 'http://localhost:8000/'
    }),
    proxy('/socket.io/', {
      target: 'ws://localhost:8000/',
      ws: true
    })
  ],
  plugins: [
    commonjs({
      include: [
        'node_modules/linkifyjs/**/*',
        'node_modules/moment/**/*',
        'node_modules/hammerjs/**/*',
        'node_modules/chart.js/**/*',
        '**/*/node_modules/linkifyjs/**/*',
        '**/*/node_modules/i18next-http-backend/**/*'
      ],
    }),
  ],
};
