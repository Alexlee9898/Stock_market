export const config = { runtime: "edge" };

/**
 * 行情数据转发（Vercel Edge）。
 * GET：`/api/fproxy?p=quote&symbol=AAPL` 或 `p=calendar%2Fearnings&from=…`（p 为上游 v1 子路径，可含 /）。
 * POST：仅支持 `p=stock/screener`，请求体 JSON 原样转发至 Finnhub（用于按市值筛选等）。
 */
export default async function handler(request: Request): Promise<Response> {
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
        error: "SERVER_QUOTE_KEY_MISSING",
        hint: "请在部署平台为该项目配置行情接口密钥环境变量，保存后重新部署。",
      },
      { status: 503 },
    );
  }

  if (request.method === "POST") {
    if (subPath !== "stock/screener") {
      return Response.json({ error: "POST only allowed for p=stock/screener" }, { status: 405 });
    }
    const upstreamParams = new URLSearchParams();
    upstreamParams.set("token", token);
    const upstream = `https://finnhub.io/api/v1/${subPath}?${upstreamParams.toString()}`;
    const body = await request.text();
    const upstreamRes = await fetch(upstream, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": request.headers.get("content-type") ?? "application/json",
      },
      body: body || "{}",
    });
    const ct = upstreamRes.headers.get("content-type") ?? "application/json; charset=utf-8";
    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      headers: { "content-type": ct },
    });
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD, POST" } });
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
