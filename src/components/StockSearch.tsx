import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchStockSymbols, type FinnhubSearchHit } from "../api/finnhub";

const MAX_HITS = 35;

interface Props {
  /** 与区块标题同一行，靠右排列（用于首页「热门美股」） */
  inline?: boolean;
}

export function StockSearch({ inline = false }: Props) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<FinnhubSearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const blurTimer = useRef<number | null>(null);

  const clearBlurTimer = useCallback(() => {
    if (blurTimer.current != null) {
      clearTimeout(blurTimer.current);
      blurTimer.current = null;
    }
  }, []);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 1) {
      setHits([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let cancelled = false;
    const t = window.setTimeout(() => {
      searchStockSymbols(term)
        .then((list) => {
          if (cancelled) return;
          setHits(list.slice(0, MAX_HITS));
        })
        .catch(() => {
          if (cancelled) return;
          setHits([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 280);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [q]);

  const looksLikeTicker = (s: string) => /^[A-Za-z]{1,6}(\.[A-Z])?$/.test(s.trim());

  const goSymbol = useCallback(
    (sym: string) => {
      const s = sym.trim().toUpperCase();
      if (!s) return;
      navigate(`/stock/${encodeURIComponent(s)}`);
      setQ("");
      setHits([]);
      setOpen(false);
    },
    [navigate],
  );

  const showDropdown = open && (loading || hits.length > 0 || q.trim().length >= 1);

  return (
    <div className={"stock-search" + (inline ? " stock-search--inline" : "")}>
      {!inline ? (
        <label className="stock-search-label" htmlFor="stock-search-input">
          搜索美股
        </label>
      ) : null}
      <div className="stock-search-wrap">
        <input
          id="stock-search-input"
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          spellCheck={false}
          aria-label="搜索美股"
          placeholder={inline ? "搜索代码或公司名…" : "输入代码或公司名，如 NVDA、Bank of America…"}
          className="stock-search-input"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            clearBlurTimer();
            setOpen(true);
          }}
          onBlur={() => {
            blurTimer.current = window.setTimeout(() => setOpen(false), 180);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
            }
            if (e.key === "Enter") {
              const t = q.trim();
              if (hits[0]?.symbol) {
                e.preventDefault();
                goSymbol(hits[0].symbol);
              } else if (looksLikeTicker(t)) {
                e.preventDefault();
                goSymbol(t.toUpperCase());
              }
            }
          }}
        />
        {showDropdown ? (
          <div className="stock-search-dropdown" role="listbox" aria-label="搜索结果">
            {loading ? <div className="stock-search-status">搜索中…</div> : null}
            {!loading && hits.length === 0 && q.trim().length >= 1 ? (
              <div className="stock-search-status">
                未找到匹配结果。若你输入的是代码（如 GOOGL），可直接按 Enter 进入详情。
              </div>
            ) : null}
            <ul className="stock-search-list">
              {hits.map((h) => {
                const sym = h.symbol ?? "";
                const label = h.displaySymbol ?? sym;
                const sub = h.description?.trim();
                return (
                  <li key={sym + (sub ?? "")} role="option">
                    <button
                      type="button"
                      className="stock-search-hit"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => goSymbol(sym)}
                    >
                      <span className="stock-search-hit-symbol">{label}</span>
                      {sub ? <span className="stock-search-hit-desc">{sub}</span> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
