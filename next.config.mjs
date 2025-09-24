/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname:
          "strapi-xr-website-backend-media-storage.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
