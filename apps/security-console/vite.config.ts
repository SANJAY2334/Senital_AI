import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@sentinelai/synthetic-log-generator': path.resolve(
        __dirname,
        '../../tools/synthetic-log-generator/src/index.ts',
      ),
      '@sentinelai/ocsf-normalizer': path.resolve(
        __dirname,
        '../../services/ocsf-normalizer/src/index.ts',
      ),
      '@sentinelai/ocsf-types': path.resolve(__dirname, '../../packages/ocsf-types/src/index.ts'),
      '@sentinelai/shared-types': path.resolve(
        __dirname,
        '../../packages/shared-types/src/index.ts',
      ),
      '@sentinelai/config': path.resolve(__dirname, '../../packages/config/src/index.ts'),
      '@sentinelai/errors': path.resolve(__dirname, '../../packages/errors/src/index.ts'),
      '@sentinelai/logger': path.resolve(__dirname, '../../packages/logger/src/index.ts'),
      '@sentinelai/security': path.resolve(__dirname, '../../packages/security/src/index.ts'),
      '@sentinelai/telemetry': path.resolve(__dirname, '../../packages/telemetry/src/index.ts'),
      '@sentinelai/utils': path.resolve(__dirname, '../../packages/utils/src/index.ts'),
      '@sentinelai/validation': path.resolve(__dirname, '../../packages/validation/src/index.ts'),
    },
  },
});
