import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The session lives in an HttpOnly cookie set by the Laravel API origin.
  // No environment-specific rewrites are needed: the browser calls the API
  // directly with credentials included (see src/lib/api-client.ts).
  reactStrictMode: true,
};

export default nextConfig;
