import { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig:NextConfig = {
  env: {
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
    NEXT_PUBLIC_STRIPE_SECRET_KEY: process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY,
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    NEXT_PUBLIC_PAYPAL_CLIENT_SECRET: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET,
    NEXT_PUBLIC_PAYPAL_BASE_URL: process.env.NEXT_PUBLIC_PAYPAL_BASE_URL
  },
  images: {
    domains: ['testing.indiantadka.eu','https://www.google.com/','http://localhost:5000/api/v1'], // Add your image domain here
  },
};

module.exports = nextConfig;
