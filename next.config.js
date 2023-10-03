/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['ui-avatars.com', 'www.cameo.com'],
        dangerouslyAllowSVG: true,
    },
};
module.exports = nextConfig;
