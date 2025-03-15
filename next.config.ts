import { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig:NextConfig = {
  images: {
    domains: [
      'testing.indiantadka.eu',
      'google.com', // Remove 'https://'
      'localhost', // Remove 'http://'
    ]
  },
};

module.exports = nextConfig;
