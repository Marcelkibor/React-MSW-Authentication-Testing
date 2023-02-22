import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/openmrs': {
        target: 'https://dev3.openmrs.org',
        // target:'http://10.50.200.136:8089',
        // target:"https://kibana.ampath.or.ke/",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  plugins: [react()],
  test: {
    globals:true,
    environment: 'jsdom',
  },
  setupFiles: './tests/setup.ts'
});
