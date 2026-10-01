import type { NextConfig } from "next";
import { buildContentSecurityPolicy } from "./src/lib/security-headers";

const securityHeaders = (isDev: boolean) => [
  // Only same-origin resources, no framing, no plugins; see src/lib/security-headers.ts.
  { key: "Content-Security-Policy", value: buildContentSecurityPolicy(isDev) },
  // Browsers use HTTPS only for this host and its subdomains for one year.
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // No MIME sniffing: files are only used as the type they are served as.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // No referrer leaves the site; matches the referrer meta tag in the root layout.
  { key: "Referrer-Policy", value: "no-referrer" },
  // Browser features the site never uses are switched off.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // No framing, for browsers that ignore frame-ancestors in the CSP.
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  images: {
    // Images under public/ are behind the password. The image optimizer fetches local
    // files through an internal request without the visitor's cookie, so it cannot reach
    // them any more; next/image therefore serves the files as they are.
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders(process.env.NODE_ENV === "development"),
      },
    ];
  },
};

export default nextConfig;
