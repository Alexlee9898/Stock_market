import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Finnhub 在浏览器里直连常有 CORS 问题；通过本地代理在服务端路径拼接 token，
 * 密钥只放在 .env 的 FINNHUB_API_KEY，不会打进前端 bundle。
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const finnhubKey = env.FINNHUB_API_KEY ?? "";

  const finnhubProxy = {
    "/api/finnhub": {
      target: "https://finnhub.io/api/v1",
      changeOrigin: true,
      rewrite: (path) => {
        const stripped = path.replace(/^\/api\/finnhub/, "");
        if (!finnhubKey) return stripped;
        const join = stripped.includes("?") ? "&" : "?";
        return `${stripped}${join}token=${encodeURIComponent(finnhubKey)}`;
      },
    },
  };

  return {
    plugins: [react()],
    server: { proxy: finnhubProxy },
    preview: { proxy: finnhubProxy },
  };
});
