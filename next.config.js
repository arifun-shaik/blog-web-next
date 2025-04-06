/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'po3rin.com',
      },
      {
        protocol: 'https',
        hostname: 'pon-blog-media.s3-ap-northeast-1.amazonaws.com',
      },
    ],
  },
  env: {
    BASE_URL:
      process.env.NODE_ENV === "production"
        ? process.env.API_BASE_URL
        : "http://localhost:8080",
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/api/:path*",
          // process.env.NODE_ENV === "production"
          //   ? `${process.env.API_BASE_URL}/api/:path*`
          //   : "http://localhost:8080/api/:path*",
      },
    ];
  },
  sassOptions: {
    prependData: `
      $sec-color: #1d3152;
      $main-color: #00ffc4;
    `,
  },
};

module.exports = nextConfig;
