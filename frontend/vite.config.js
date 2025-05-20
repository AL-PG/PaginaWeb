import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        // Excluir @paypal/react-paypal-js de la optimización para evitar el error outdated Optimize Dep
        exclude: ['@paypal/react-paypal-js']
    }
});