interface Props {
  variant: "demo" | "live" | "loading" | "error";
  /** 附加说明，例如错误信息 */
  detail?: string;
}

export function DataSourceNote({ variant, detail }: Props) {
  if (variant === "loading") {
    return (
      <aside className="data-note data-note--loading" role="status">
        <span className="data-note-dot" aria-hidden />
        正在连接 Finnhub 数据…
      </aside>
    );
  }

  if (variant === "live") {
    return (
      <aside className="data-note data-note--live" role="status">
        <span className="data-note-dot data-note-dot--live" aria-hidden />
        已接入 Finnhub 实时/延迟数据（非投资建议）
      </aside>
    );
  }

  if (variant === "error") {
    return (
      <aside className="data-note data-note--error" role="alert">
        无法拉取 Finnhub：{detail ?? "请检查 .env 是否配置 FINNHUB_API_KEY 并已重启 dev 服务"}
      </aside>
    );
  }

  return (
    <aside className="data-note data-note--demo" role="note">
      当前为本地演示数据。配置 <code className="data-note-code">FINNHUB_API_KEY</code> 后可通过代理加载真实行情与日历。
    </aside>
  );
}
