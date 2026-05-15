export const config = { runtime: "edge" };

/**
 * 行情数据转发（Vercel Edge）。请求 `/api/fproxy?p=quote&symbol=AAPL`
 * 或 `p=calendar%2Fearnings&from=…`（p 为上游 v1 子路径，可含 /）。
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
        error: "SERVER_QUOTE_KEY_MISSING",
        hint: "请在部署平台为该项目配置行情接口密钥环境变量，保存后重新部署。",
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
