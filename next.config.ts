import { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig:NextConfig = {
  images: {
    domains: ['testing.indiantadka.eu','https://www.google.com/','http://localhost:5000/api/v1'], // Add your image domain here
  },
};

module.exports = nextConfig;
