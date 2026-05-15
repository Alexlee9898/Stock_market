/** 由代码生成稳定色相，避免为数百只股票手写 accent */
export function accentFromSymbol(symbol: string): string {
  let h = 0;
  for (let i = 0; i < symbol.length; i++) {
    h = (h * 31 + symbol.charCodeAt(i)) >>> 0;
  }
  const hue = h % 360;
  return `hsl(${hue} 52% 42%)`;
}
