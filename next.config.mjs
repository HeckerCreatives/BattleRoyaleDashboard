/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

// ESM doesn't provide __dirname; derive it from import.meta.url
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
    output: 'export',
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
    webpack: (config) => {
        // Alias the React Native AsyncStorage import used by some SDKs to a browser shim
        config.resolve = config.resolve || {};
        config.resolve.alias = Object.assign({}, config.resolve.alias || {}, {
            '@react-native-async-storage/async-storage': path.resolve(__dirname, 'src/shims/async-storage.ts'),
        });
        return config;
    },
};

export default nextConfig;
