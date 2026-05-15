import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

/**
 * 浏览器直连上游常有 CORS；本地通过 /api/fproxy?p=子路径走开发代理。
 * 密钥放在 .env 的 FINNHUB_API_KEY。
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const finnhubKey = env.FINNHUB_API_KEY ?? "";

  const finnhubProxy = {
    "/api/fproxy": {
      target: "https://finnhub.io/api/v1",
      changeOrigin: true,
      rewrite: (fullPath) => {
        const u = new URL(fullPath, "http://localhost");
        const p = u.searchParams.get("p") ?? "";
        u.searchParams.delete("p");
        if (!p || p.includes("..")) return fullPath;
        if (!finnhubKey) return `/${p}${u.search}`;
        u.searchParams.set("token", finnhubKey);
        const qs = u.searchParams.toString();
        return `/${p}${qs ? `?${qs}` : ""}`;
      },
    },
  };

  return {
    plugins: [react()],
    server: { proxy: finnhubProxy },
    preview: { proxy: finnhubProxy },
  };
});
