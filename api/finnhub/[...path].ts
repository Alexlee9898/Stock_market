export const config = { runtime: "edge" };

/**
 * 生产环境转发：浏览器请求 /api/finnhub/* → Finnhub REST v1。
 * 密钥仅放在 Vercel 环境变量 FINNHUB_API_KEY（勿提交到 Git）。
 */
export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }

  const token = process.env.FINNHUB_API_KEY;
  if (!token) {
    return Response.json({ error: "FINNHUB_API_KEY is not configured on the server" }, { status: 503 });
  }

  const url = new URL(request.url);
  const subPath = url.pathname.replace(/^\/api\/finnhub\/?/, "");
  if (!subPath || subPath.includes("..") || subPath.startsWith("/")) {
    return Response.json({ error: "Invalid Finnhub subpath" }, { status: 400 });
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
