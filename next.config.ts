import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' }],
  },
  /*
   * The content-extraction pipeline's dependencies are Node libraries that do
   * not survive being bundled: jsdom (via @mozilla/readability) reaches
   * html-encoding-sniffer, which require()s an ESM-only package and throws
   * ERR_REQUIRE_ESM at runtime. Left external, Node resolves them itself and
   * the mixed module formats stop mattering.
   */
  serverExternalPackages: ['jsdom', '@mozilla/readability', 'pdfjs-dist', 'mammoth'],
}

export default nextConfig
