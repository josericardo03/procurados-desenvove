/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para Docker
  output: "standalone",

  // Otimizações básicas
  compress: true,
  poweredByHeader: false,

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

  // Desabilitar otimizações que podem causar erro
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
