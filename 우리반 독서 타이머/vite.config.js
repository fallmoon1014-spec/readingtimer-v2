import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/readingtimer-v2/',
  plugins: [
    react(),
    {
      name: 'force-jsx-mime-type',
      enforce: 'pre',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const originalSetHeader = res.setHeader;
          res.setHeader = function (key, value) {
            if (key.toLowerCase() === 'content-type' && value === 'text/jsx') {
              value = 'application/javascript';
            }
            return originalSetHeader.apply(this, arguments);
          };
          next();
        });
      }
    }
  ],
})
