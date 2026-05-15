export const config = { runtime: "edge" };

/**
 * 捕获 `/api/*`（根级 catch-all，避免嵌套 `api/finnhub/...` 在 Vercel 上未注册导致 404）。
 * 仅处理 `/api/finnhub/...` → Finnhub REST v1；其余返回 404。
 */
export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }

  const url = new URL(request.url);
  const parts = url.pathname
    .replace(/^\/api\/?/, "")
    .split("/")
    .filter(Boolean);

  if (parts.length === 0 || parts[0] !== "finnhub") {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const subPath = parts.slice(1).join("/");
  if (!subPath || subPath.includes("..")) {
    return Response.json({ error: "Invalid Finnhub subpath" }, { status: 400 });
  }

  const token = process.env.FINNHUB_API_KEY?.trim();
  if (!token) {
    return Response.json(
      {
        error: "FINNHUB_API_KEY is not configured on the server",
        hint: "Vercel: Project → Settings → Environment Variables → 添加 FINNHUB_API_KEY（勾选 Production），Save 后到 Deployments 对最新部署执行 Redeploy。",
      },
      { status: 503 },
    );
  }

  const upstreamParams = new URLSearchParams(url.searchParams);
  upstreamParams.set("token", token);

  const upstream = `https://finnhub.io/api/v1/${subPath}?${upstreamParams.toString()}`;

  const upstreamRes = await fetch(upstream, {
    method: request.method,
    headers: { Accept: "application/json" },
  });

  const ct = upstreamRes.headers.get("content-type") ?? "application/json; charset=utf-8";

  if (request.method === "HEAD") {
    return new Response(null, { status: upstreamRes.status, headers: { "content-type": ct } });
  }

  return new Response(upstreamRes.body, {
    status: upstreamRes.status,
    headers: { "content-type": ct },
  });
}
