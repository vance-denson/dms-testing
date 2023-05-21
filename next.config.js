/** @type {import('next').NextConfig} */
const nextConfig = {
    serverRuntimeConfig: {
        // Will only be available on the server side
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        NEXT_PUBLIC_SUPABASE_ANON_KEY_CUDAHY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_CUDAHY,
        NEXT_PUBLIC_SUPABASE_URL_CUDAHY: process.env.NEXT_PUBLIC_SUPABASE_URL_CUDAHY,
    },
    publicRuntimeConfig: {
        // Will be available on both server and client
        staticFolder: '/static',
    },
    reactStrictMode: true,
    swcMinify: true,
    webpack(config) {
        config.experiments = { ...config.experiments, topLevelAwait: true };
        return config;
    },
};

export default nextConfig;
