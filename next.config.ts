import { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig:NextConfig = {
  images: {
    domains: ['testing.indiantadka.eu','https://www.google.com/'], // Add your image domain here
  },
};

module.exports = nextConfig;
