/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apptos.s3.ap-southeast-2.amazonaws.com",
        port: "", // Leave this empty if you're not using a specific port
        pathname: "/**", // This allows all images from the host
      },
    ],
    domains: ["placehold.co"],
  },
};

export default nextConfig;
