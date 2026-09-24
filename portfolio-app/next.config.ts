import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  images: {
    // Images under public/ are behind the password. The image optimizer fetches local
    // files through an internal request without the visitor's cookie, so it cannot reach
    // them any more; next/image therefore serves the files as they are.
    unoptimized: true,
  },
};

export default nextConfig;
