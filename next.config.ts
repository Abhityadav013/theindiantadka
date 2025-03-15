import { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig:NextConfig = {
  images: {
    domains: [
      'testing.indiantadka.eu',
      'google.com', // Remove 'https://'
      'localhost', // Remove 'http://'
      'd17b2befa637skvb.public.blob.vercel-storage.com', // Correct format
    ]
  },
};

module.exports = nextConfig;
