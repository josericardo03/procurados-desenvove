import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para Docker
  output: "standalone",

  // Otimizações básicas
  compress: true,
  poweredByHeader: false,

  // Configuração de alias para resolver imports
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
      "@/components": path.resolve(__dirname, "components"),
      "@/services": path.resolve(__dirname, "services"),
      "@/types": path.resolve(__dirname, "types"),
      "@/hooks": path.resolve(__dirname, "hooks"),
      "@/lib": path.resolve(__dirname, "lib"),
    };
    return config;
  },

  // Configurações de imagem
  images: {
    domains: ["images.unsplash.com", "abitus-api.geia.vip"],
    formats: ["image/webp", "image/avif"],
  },

  // Configurações de segurança básicas
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },

  // Configurações para evitar erros de build
  trailingSlash: false,
  skipTrailingSlashRedirect: true,

  // Configurações experimentais
  experimental: {
    esmExternals: true,
    optimizeCss: false,
  },
};

export default nextConfig;
