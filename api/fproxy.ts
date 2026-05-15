export const config = { runtime: "edge" };

/**
 * Finnhub 转发（Vercel Edge）。请求 `/api/fproxy?p=quote&symbol=AAPL`
 * 或 `p=calendar%2Fearnings&from=…`（p 为 v1 下的子路径，可含 /）。
 */
export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }

  const url = new URL(request.url);
  const subPath = (url.searchParams.get("p") ?? "").replace(/^\/+|\/+$/g, "");
  url.searchParams.delete("p");

  if (!subPath || subPath.includes("..") || subPath.includes("//")) {
    return Response.json({ error: "Invalid or missing path parameter p" }, { status: 400 });
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
