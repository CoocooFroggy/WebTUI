'use strict';

var React4 = require('react');
var jsxRuntime = require('react/jsx-runtime');
var figlet = require('figlet');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React4__default = /*#__PURE__*/_interopDefault(React4);
var figlet__default = /*#__PURE__*/_interopDefault(figlet);

// src/components/TUIRoot.tsx
var TUIContext = React4.createContext(null);

// src/context/themes.ts
var themes = {
  mocha: {
    "--tui-fg": "#cdd6f4",
    "--tui-fg-muted": "#a6adc8",
    "--tui-fg-subtle": "#6c7086",
    "--tui-bg": "#1e1e2e",
    "--tui-bg-surface": "#313244",
    "--tui-bg-overlay": "#45475a",
    "--tui-accent": "#89b4fa",
    "--tui-accent-muted": "#74c7ec",
    "--tui-border": "#585b70",
    "--tui-border-focus": "#89b4fa",
    "--tui-success": "#a6e3a1",
    "--tui-warning": "#f9e2af",
    "--tui-error": "#f38ba8",
    "--tui-info": "#89dceb",
    "--tui-cursor-fg": "#1e1e2e",
    "--tui-cursor-bg": "#cdd6f4",
    "--tui-selection-bg": "#45475a",
    "--tui-selection-fg": "#cdd6f4"
  },
  latte: {
    "--tui-fg": "#4c4f69",
    "--tui-fg-muted": "#5c5f77",
    "--tui-fg-subtle": "#9ca0b0",
    "--tui-bg": "#eff1f5",
    "--tui-bg-surface": "#e6e9ef",
    "--tui-bg-overlay": "#dce0e8",
    "--tui-accent": "#1e66f5",
    "--tui-accent-muted": "#209fb5",
    "--tui-border": "#bcc0cc",
    "--tui-border-focus": "#1e66f5",
    "--tui-success": "#40a02b",
    "--tui-warning": "#df8e1d",
    "--tui-error": "#d20f39",
    "--tui-info": "#04a5e5",
    "--tui-cursor-fg": "#eff1f5",
    "--tui-cursor-bg": "#4c4f69",
    "--tui-selection-bg": "#dce0e8",
    "--tui-selection-fg": "#4c4f69"
  },
  nord: {
    "--tui-fg": "#d8dee9",
    "--tui-fg-muted": "#81a1c1",
    "--tui-fg-subtle": "#4c566a",
    "--tui-bg": "#2e3440",
    "--tui-bg-surface": "#3b4252",
    "--tui-bg-overlay": "#434c5e",
    "--tui-accent": "#88c0d0",
    "--tui-accent-muted": "#5e81ac",
    "--tui-border": "#4c566a",
    "--tui-border-focus": "#88c0d0",
    "--tui-success": "#a3be8c",
    "--tui-warning": "#ebcb8b",
    "--tui-error": "#bf616a",
    "--tui-info": "#b48ead",
    "--tui-cursor-fg": "#2e3440",
    "--tui-cursor-bg": "#d8dee9",
    "--tui-selection-bg": "#434c5e",
    "--tui-selection-fg": "#d8dee9"
  },
  gruvbox: {
    "--tui-fg": "#ebdbb2",
    "--tui-fg-muted": "#d5c4a1",
    "--tui-fg-subtle": "#928374",
    "--tui-bg": "#1d2021",
    "--tui-bg-surface": "#282828",
    "--tui-bg-overlay": "#3c3836",
    "--tui-accent": "#fabd2f",
    "--tui-accent-muted": "#d3869b",
    "--tui-border": "#504945",
    "--tui-border-focus": "#fabd2f",
    "--tui-success": "#b8bb26",
    "--tui-warning": "#fabd2f",
    "--tui-error": "#fb4934",
    "--tui-info": "#83a598",
    "--tui-cursor-fg": "#1d2021",
    "--tui-cursor-bg": "#ebdbb2",
    "--tui-selection-bg": "#3c3836",
    "--tui-selection-fg": "#ebdbb2"
  }
};
var CSS_SENTINEL = "data-tui-base";
function injectBaseCSS() {
  if (document.querySelector(`[${CSS_SENTINEL}]`)) return;
  const style = document.createElement("style");
  style.setAttribute(CSS_SENTINEL, "");
  style.textContent = `
[data-tui-root],
[data-tui-root] * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

[data-tui-root] {
  font-family: var(--tui-font, 'JetBrains Mono', 'Cascadia Code', 'Fira Code', 'Iosevka', monospace);
  font-size: var(--tui-font-size);
  line-height: var(--tui-line-height);
  color: var(--tui-fg);
  background: var(--tui-bg);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-variant-ligatures: none;
  position: relative;
}

[data-tui-root] pre,
[data-tui-root] code {
  font-family: inherit;
  font-size: inherit;
}

@keyframes tui-blink {
  50% { opacity: 0; }
}

.tui-blink {
  animation: tui-blink 1s step-start infinite;
}

@media (prefers-reduced-motion: reduce) {
  .tui-blink { animation: none !important; }
}
`;
  document.head.appendChild(style);
}
function injectFont(fontUrl) {
  const id = "tui-font-link";
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = fontUrl;
  document.head.appendChild(link);
}
var JETBRAINS_MONO_URL = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,700;1,400&display=swap";
function TUIRoot({
  theme: initialFlavor = "mocha",
  customTheme,
  fontSize = 14,
  lineHeight = 1.2,
  fontUrl = JETBRAINS_MONO_URL,
  fullscreen,
  children,
  className,
  style
}) {
  const [flavor, setFlavorState] = React4.useState(initialFlavor);
  const rootRef = React4.useRef(null);
  const containerRegistry = React4.useRef(/* @__PURE__ */ new Map());
  React4.useEffect(() => {
    injectBaseCSS();
    if (fontUrl) injectFont(fontUrl);
  }, [fontUrl]);
  React4.useEffect(() => {
    setFlavorState(initialFlavor);
  }, [initialFlavor]);
  const setFlavor = React4.useCallback((f) => setFlavorState(f), []);
  const registerContainer = React4.useCallback(
    (id, ref) => {
      containerRegistry.current.set(id, ref);
    },
    []
  );
  const unregisterContainer = React4.useCallback((id) => {
    containerRegistry.current.delete(id);
  }, []);
  const getContainerRect = React4.useCallback((id) => {
    const ref = containerRegistry.current.get(id);
    return ref?.current?.getBoundingClientRect() ?? null;
  }, []);
  const resolvedTheme = { ...themes[flavor], ...customTheme };
  const cssVars = {
    "--tui-font-size": `${fontSize}px`,
    "--tui-line-height": String(lineHeight),
    "--tui-cell-w": "1ch",
    "--tui-cell-h": `${fontSize * lineHeight}px`,
    ...resolvedTheme
  };
  const ctx = {
    flavor,
    setFlavor,
    theme: resolvedTheme,
    rootRef,
    fontSize,
    lineHeight,
    registerContainer,
    unregisterContainer,
    getContainerRect
  };
  return /* @__PURE__ */ jsxRuntime.jsx(TUIContext.Provider, { value: ctx, children: /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      "data-tui-root": "",
      "data-tui-flavor": flavor,
      ref: rootRef,
      className,
      style: { ...fullscreen && { width: "100vw", height: "100vh", overflow: "hidden" }, ...cssVars, ...style },
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "div",
          {
            "data-tui-content": "",
            style: { position: "relative", width: "100%", height: "100%" },
            children
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "svg",
          {
            "data-tui-overlay": "",
            "aria-hidden": true,
            style: {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 9999,
              overflow: "visible"
            }
          }
        )
      ]
    }
  ) });
}

// src/components/Container/border.ts
var BORDERS = {
  single: { tl: "\u250C", tr: "\u2510", bl: "\u2514", br: "\u2518", h: "\u2500", v: "\u2502" },
  double: { tl: "\u2554", tr: "\u2557", bl: "\u255A", br: "\u255D", h: "\u2550", v: "\u2551" },
  rounded: { tl: "\u256D", tr: "\u256E", bl: "\u2570", br: "\u256F", h: "\u2500", v: "\u2502" },
  heavy: { tl: "\u250F", tr: "\u2513", bl: "\u2517", br: "\u251B", h: "\u2501", v: "\u2503" }
};
function useTUI() {
  const ctx = React4.useContext(TUIContext);
  if (!ctx) throw new Error("useTUI must be used inside <TUIRoot>");
  return ctx;
}
var CELL_H = "var(--tui-cell-h, 1.2em)";
var REP = 200;
function HFill({ char }) {
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: char.repeat(REP) });
}
function VFill({ char }) {
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: (char + "\n").repeat(REP) });
}
function TopFill({ char, title, titleSide }) {
  if (!title) {
    return /* @__PURE__ */ jsxRuntime.jsx(HFill, { char });
  }
  const label = ` ${title} `;
  const anchor = char + char;
  if (titleSide === "right") {
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", width: "100%", overflow: "hidden", whiteSpace: "pre" }, children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { style: { flex: 1, overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntime.jsx(HFill, { char }) }),
      /* @__PURE__ */ jsxRuntime.jsxs("span", { style: { flexShrink: 0 }, children: [
        anchor,
        label
      ] })
    ] });
  }
  if (titleSide === "center") {
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", width: "100%", overflow: "hidden", whiteSpace: "pre" }, children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { style: { flex: 1, overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntime.jsx(HFill, { char }) }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { style: { flexShrink: 0 }, children: label }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { style: { flex: 1, overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntime.jsx(HFill, { char }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", width: "100%", overflow: "hidden", whiteSpace: "pre" }, children: [
    /* @__PURE__ */ jsxRuntime.jsxs("span", { style: { flexShrink: 0 }, children: [
      label,
      anchor
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("span", { style: { flex: 1, overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntime.jsx(HFill, { char }) })
  ] });
}
function Container({
  cols,
  rows,
  border = "none",
  title,
  titleSide = "left",
  direction = "column",
  gap = 0,
  padding,
  align,
  justify,
  fill,
  bg,
  borderColor,
  id,
  className,
  style,
  children
}) {
  const ref = React4.useRef(null);
  const { registerContainer, unregisterContainer } = useTUI();
  React4.useEffect(() => {
    if (!id) return;
    registerContainer(id, ref);
    return () => unregisterContainer(id);
  }, [id, registerContainer, unregisterContainer]);
  const hasBorder = border !== "none";
  const c = hasBorder ? BORDERS[border] : null;
  const [padV, padH] = Array.isArray(padding) ? padding : [padding ?? 0, padding ?? 0];
  const outerStyle = {
    position: "relative",
    ...cols !== void 0 ? { width: `calc(${cols} * 1ch)`, flexShrink: 0 } : { width: "100%" },
    ...rows !== void 0 ? { height: `calc(${rows} * ${CELL_H})` } : fill ? { height: "100%" } : {},
    ...hasBorder && {
      paddingTop: CELL_H,
      paddingBottom: CELL_H,
      paddingLeft: "1ch",
      paddingRight: "1ch",
      boxSizing: "border-box"
    },
    ...bg && { background: bg },
    ...style
  };
  const innerStyle = {
    position: "relative",
    width: "100%",
    ...rows !== void 0 || fill ? { height: "100%" } : {},
    display: "flex",
    flexDirection: direction,
    ...gap > 0 && {
      gap: `calc(${gap} * ${CELL_H}) calc(${gap} * 1ch)`
    },
    ...padV > 0 && {
      paddingTop: `calc(${padV} * ${CELL_H})`,
      paddingBottom: `calc(${padV} * ${CELL_H})`
    },
    ...padH > 0 && {
      paddingLeft: `calc(${padH} * 1ch)`,
      paddingRight: `calc(${padH} * 1ch)`
    },
    ...align && {
      alignItems: align === "start" ? "flex-start" : align === "end" ? "flex-end" : "center"
    },
    ...justify && {
      justifyContent: justify === "start" ? "flex-start" : justify === "end" ? "flex-end" : justify === "space-between" ? "space-between" : "center"
    },
    overflow: "hidden",
    boxSizing: "border-box"
  };
  const borderStyle = {
    position: "absolute",
    pointerEvents: "none",
    color: borderColor ?? "var(--tui-border)",
    fontFamily: "inherit",
    fontSize: "inherit",
    lineHeight: "var(--tui-line-height, 1.2)",
    margin: 0,
    padding: 0,
    overflow: "hidden",
    whiteSpace: "pre"
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      "data-tui-container": "",
      ref,
      className,
      style: outerStyle,
      children: [
        hasBorder && c && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, style: { ...borderStyle, top: 0, left: 0, width: "1ch", height: CELL_H, overflow: "visible" }, children: c.tl }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, style: { ...borderStyle, top: 0, right: 0, width: "1ch", height: CELL_H, overflow: "visible" }, children: c.tr }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, style: { ...borderStyle, bottom: 0, left: 0, width: "1ch", height: CELL_H, overflow: "visible" }, children: c.bl }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, style: { ...borderStyle, bottom: 0, right: 0, width: "1ch", height: CELL_H, overflow: "visible" }, children: c.br }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { "aria-hidden": true, style: { ...borderStyle, top: 0, left: "1ch", right: "1ch", height: CELL_H, display: "flex", alignItems: "flex-start" }, children: /* @__PURE__ */ jsxRuntime.jsx(TopFill, { char: c.h, title, titleSide }) }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { "aria-hidden": true, style: { ...borderStyle, bottom: 0, left: "1ch", right: "1ch", height: CELL_H }, children: /* @__PURE__ */ jsxRuntime.jsx(HFill, { char: c.h }) }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { "aria-hidden": true, style: { ...borderStyle, top: CELL_H, bottom: CELL_H, left: 0, width: "1ch" }, children: /* @__PURE__ */ jsxRuntime.jsx(VFill, { char: c.v }) }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { "aria-hidden": true, style: { ...borderStyle, top: CELL_H, bottom: CELL_H, right: 0, width: "1ch" }, children: /* @__PURE__ */ jsxRuntime.jsx(VFill, { char: c.v }) })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { style: innerStyle, children })
      ]
    }
  );
}
var VARIANT_STYLES = {
  default: { color: "var(--tui-fg)" },
  muted: { color: "var(--tui-fg-muted)" },
  subtle: { color: "var(--tui-fg-subtle)" },
  inverted: { color: "var(--tui-bg)", background: "var(--tui-fg)" },
  accent: { color: "var(--tui-accent)" },
  success: { color: "var(--tui-success)" },
  warning: { color: "var(--tui-warning)" },
  error: { color: "var(--tui-error)" },
  info: { color: "var(--tui-info)" }
};
function Text({
  variant = "default",
  caps,
  bold,
  italic,
  underline,
  strikethrough,
  dim,
  blink,
  nowrap,
  as: Tag = "span",
  className,
  style,
  children,
  onClick
}) {
  const decorations = [];
  if (underline) decorations.push("underline");
  if (strikethrough) decorations.push("line-through");
  const computedStyle = {
    ...VARIANT_STYLES[variant],
    ...caps && { textTransform: "uppercase", letterSpacing: "0.08ch" },
    ...bold && { fontWeight: 700 },
    ...italic && { fontStyle: "italic" },
    ...decorations.length > 0 && { textDecoration: decorations.join(" ") },
    ...dim && { opacity: 0.5 },
    ...nowrap && { whiteSpace: "nowrap" },
    ...style
  };
  const classNames = [className, blink ? "tui-blink" : ""].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsxRuntime.jsx(
    Tag,
    {
      className: classNames || void 0,
      style: computedStyle,
      onClick,
      children
    }
  );
}
var FONT_PATH = "https://unpkg.com/figlet@1/fonts";
var fontPathSet = false;
function ensureFontPath() {
  if (fontPathSet) return;
  figlet__default.default.defaults({ fontPath: FONT_PATH });
  fontPathSet = true;
}
function renderFiglet(text, font) {
  return new Promise((resolve, reject) => {
    figlet__default.default.text(text, { font }, (err, result) => {
      if (err) reject(err);
      else resolve(result ?? "");
    });
  });
}
var VARIANT_COLORS = {
  default: "var(--tui-fg)",
  muted: "var(--tui-fg-muted)",
  subtle: "var(--tui-fg-subtle)",
  inverted: "var(--tui-bg)",
  accent: "var(--tui-accent)",
  success: "var(--tui-success)",
  warning: "var(--tui-warning)",
  error: "var(--tui-error)",
  info: "var(--tui-info)"
};
function BigText({
  children,
  font = "Standard",
  variant = "default",
  align = "left",
  fallback,
  className,
  style
}) {
  const [output, setOutput] = React4.useState(null);
  const [error, setError] = React4.useState(null);
  React4.useEffect(() => {
    ensureFontPath();
    let cancelled = false;
    setOutput(null);
    setError(null);
    renderFiglet(children, font).then((result) => {
      if (!cancelled) setOutput(result);
    }).catch((err) => {
      if (!cancelled) setError(String(err));
    });
    return () => {
      cancelled = true;
    };
  }, [children, font]);
  if (error) {
    return /* @__PURE__ */ jsxRuntime.jsxs("span", { style: { color: "var(--tui-error)" }, children: [
      "BigText error: ",
      error
    ] });
  }
  if (output === null) {
    return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: fallback ?? /* @__PURE__ */ jsxRuntime.jsx("span", { style: { color: "var(--tui-fg-subtle)" }, children: "..." }) });
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    "pre",
    {
      role: "img",
      "aria-label": children,
      className,
      style: {
        color: variant === "inverted" ? "var(--tui-bg)" : VARIANT_COLORS[variant],
        ...variant === "inverted" && { background: "var(--tui-fg)" },
        textAlign: align,
        fontFamily: "inherit",
        fontSize: "inherit",
        lineHeight: "var(--tui-line-height)",
        ...style
      },
      children: output
    }
  );
}
function useCellSize(rootRef) {
  const [size, setSize] = React4.useState({ w: 8, h: 16.8 });
  React4.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const probe = document.createElement("span");
    probe.style.cssText = "position:absolute;visibility:hidden;white-space:pre;pointer-events:none;";
    probe.textContent = "0";
    root.appendChild(probe);
    const rect = probe.getBoundingClientRect();
    setSize({ w: rect.width || 8, h: rect.height || 16.8 });
    root.removeChild(probe);
  }, [rootRef]);
  return size;
}
var ASCII_RAMP = " \u2591\u2592\u2593\u2588";
var gridCache = /* @__PURE__ */ new Map();
function gridCacheKey(src, cols, rows, mode, invert, cellW, cellH) {
  return `${src}|${cols}|${rows ?? "auto"}|${mode}|${invert}|${cellW.toFixed(2)}|${cellH.toFixed(2)}`;
}
function rgbToLuminance(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}
function toRgba(r, g, b, a) {
  return `rgba(${r},${g},${b},${(a / 255).toFixed(2)})`;
}
function buildHalfBlockHtml(data, width, height, invert) {
  const base = "width:1ch;display:inline-block;text-align:center;flex-shrink:0";
  const charRows = Math.floor(height / 2);
  const rows = [];
  for (let row = 0; row < charRows; row++) {
    const spans = [];
    for (let col = 0; col < width; col++) {
      const topIdx = (row * 2 * width + col) * 4;
      const botIdx = ((row * 2 + 1) * width + col) * 4;
      let tr = data[topIdx], tg = data[topIdx + 1], tb = data[topIdx + 2], ta = data[topIdx + 3];
      let br = data[botIdx], bg2 = data[botIdx + 1], bb = data[botIdx + 2], ba = data[botIdx + 3];
      if (invert) {
        tr = 255 - tr;
        tg = 255 - tg;
        tb = 255 - tb;
        br = 255 - br;
        bg2 = 255 - bg2;
        bb = 255 - bb;
      }
      const topLum = rgbToLuminance(tr, tg, tb) * (ta / 255);
      const botLum = rgbToLuminance(br, bg2, bb) * (ba / 255);
      const threshold = 32;
      const topBright = topLum > threshold;
      const botBright = botLum > threshold;
      let char;
      let style = base;
      if (topBright && botBright) {
        char = "\u2580";
        style += `;color:${toRgba(tr, tg, tb, ta)};background:${toRgba(br, bg2, bb, ba)}`;
      } else if (topBright) {
        char = "\u2580";
        style += `;color:${toRgba(tr, tg, tb, ta)}`;
      } else if (botBright) {
        char = "\u2584";
        style += `;color:${toRgba(br, bg2, bb, ba)}`;
      } else {
        char = " ";
      }
      spans.push(`<span style="${style}">${char}</span>`);
    }
    rows.push(`<div style="display:flex;white-space:pre;height:var(--tui-cell-h,1.2em)">${spans.join("")}</div>`);
  }
  return rows.join("");
}
function processAsciiGray(data, width, height, invert) {
  let result = "";
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = (row * width + col) * 4;
      let lum = rgbToLuminance(data[idx], data[idx + 1], data[idx + 2]) * (data[idx + 3] / 255);
      if (invert) lum = 255 - lum;
      const charIdx = Math.floor(lum / 255 * (ASCII_RAMP.length - 1));
      result += ASCII_RAMP[charIdx];
    }
    if (row < height - 1) result += "\n";
  }
  return result;
}
var TUIImage = React4__default.default.memo(function TUIImage2({
  src,
  cols,
  rows,
  mode = "half-block",
  crossOrigin = "anonymous",
  invert = false,
  fallback,
  className,
  style
}) {
  const { rootRef } = useTUI();
  const cellSize = useCellSize(rootRef);
  const [halfBlockHtml, setHalfBlockHtml] = React4.useState(null);
  const [asciiOutput, setAsciiOutput] = React4.useState(null);
  const [error, setError] = React4.useState(null);
  React4.useLayoutEffect(() => {
    if (cellSize.w === 0) return;
    const cacheKey = gridCacheKey(src, cols, rows, mode, invert, cellSize.w, cellSize.h);
    const cached = gridCache.get(cacheKey);
    if (cached) {
      setError(null);
      if (cached.kind === "half-block") {
        setHalfBlockHtml(cached.html);
      } else {
        setAsciiOutput(cached.output);
      }
      return;
    }
    setHalfBlockHtml(null);
    setAsciiOutput(null);
    setError(null);
    let cancelled = false;
    const pixelCols = cols;
    const pixelRows = rows !== void 0 ? mode === "half-block" ? rows * 2 : rows : void 0;
    const img = new Image();
    img.crossOrigin = crossOrigin;
    img.onload = () => {
      const aspect = img.naturalHeight / img.naturalWidth;
      const outCols = pixelCols;
      const outRows = pixelRows !== void 0 ? pixelRows : mode === "half-block" ? Math.round(pixelCols * aspect * (cellSize.w / (cellSize.h / 2))) : Math.round(pixelCols * aspect * (cellSize.w / cellSize.h));
      const canvas = document.createElement("canvas");
      canvas.width = outCols;
      canvas.height = outRows;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, outCols, outRows);
      let imageData;
      try {
        imageData = ctx.getImageData(0, 0, outCols, outRows);
      } catch {
        if (!cancelled) setError("CORS error: image pixel data could not be read.\nAdd Access-Control-Allow-Origin headers or use a CORS proxy.");
        return;
      }
      if (mode === "half-block") {
        const html = buildHalfBlockHtml(imageData.data, outCols, outRows, invert);
        gridCache.set(cacheKey, { kind: "half-block", html });
        if (!cancelled) setHalfBlockHtml(html);
      } else {
        const result = processAsciiGray(imageData.data, outCols, outRows, invert);
        gridCache.set(cacheKey, { kind: "ascii-gray", output: result });
        if (!cancelled) setAsciiOutput(result);
      }
    };
    img.onerror = () => {
      if (!cancelled) setError("Failed to load image.");
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src, cols, rows, mode, crossOrigin, invert, cellSize.w, cellSize.h]);
  if (error) {
    return fallback ?? /* @__PURE__ */ jsxRuntime.jsx(
      "pre",
      {
        style: {
          color: "var(--tui-error)",
          fontFamily: "inherit",
          fontSize: "inherit",
          lineHeight: "var(--tui-line-height)"
        },
        children: `\u26A0 ${error}`
      }
    );
  }
  if (mode === "ascii-gray") {
    if (asciiOutput === null) {
      return /* @__PURE__ */ jsxRuntime.jsx("span", { style: { color: "var(--tui-fg-subtle)" }, children: "..." });
    }
    return /* @__PURE__ */ jsxRuntime.jsx(
      "pre",
      {
        className,
        style: {
          fontFamily: "inherit",
          fontSize: "inherit",
          lineHeight: "var(--tui-line-height)",
          color: "var(--tui-fg)",
          ...style
        },
        children: asciiOutput
      }
    );
  }
  if (halfBlockHtml === null) {
    return /* @__PURE__ */ jsxRuntime.jsx("span", { style: { color: "var(--tui-fg-subtle)" }, children: "..." });
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className,
      style: {
        fontFamily: "inherit",
        fontSize: "inherit",
        lineHeight: "var(--tui-line-height)",
        ...style
      },
      dangerouslySetInnerHTML: { __html: halfBlockHtml }
    }
  );
});

exports.BigText = BigText;
exports.Container = Container;
exports.TUIImage = TUIImage;
exports.TUIRoot = TUIRoot;
exports.Text = Text;
exports.themes = themes;
exports.useCellSize = useCellSize;
exports.useTUI = useTUI;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map