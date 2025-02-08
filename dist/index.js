"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  useVirtualList: () => use_virtual_list_default
});
module.exports = __toCommonJS(src_exports);

// src/use-virtual-list.ts
var import_react = __toESM(require("react"));
var import_react_dom = require("react-dom");
var SCROLLING_WAIT = 100;
var useVirtualized = ({
  data,
  height,
  rowHeight,
  buffer = 50
}) => {
  const [scrollTop, setScrollTop] = import_react.default.useState(0);
  const [scrollLeft, setScrollLeft] = import_react.default.useState(0);
  const [isScrollingX, setIsScrollingX] = import_react.default.useState(false);
  const [isScrollingY, setIsScrollingY] = import_react.default.useState(false);
  const containerRef = import_react.default.useRef(null);
  const scrollTimeoutXRef = import_react.default.useRef(null);
  const scrollTimeoutYRef = import_react.default.useRef(null);
  const scrollXHandler = (newScrollLeft) => {
    (0, import_react_dom.flushSync)(() => {
      setIsScrollingX(true);
      setScrollLeft(newScrollLeft);
    });
    if (scrollTimeoutXRef.current)
      clearTimeout(scrollTimeoutXRef.current);
    scrollTimeoutXRef.current = setTimeout(
      () => setIsScrollingX(false),
      SCROLLING_WAIT
    );
  };
  const scrollYHandler = (newScrollTop) => {
    (0, import_react_dom.flushSync)(() => {
      setIsScrollingY(true);
      setScrollTop(newScrollTop);
    });
    if (scrollTimeoutYRef.current)
      clearTimeout(scrollTimeoutYRef.current);
    scrollTimeoutYRef.current = setTimeout(
      () => setIsScrollingY(false),
      SCROLLING_WAIT
    );
  };
  const handleScroll = () => {
    if (!containerRef.current)
      return;
    requestAnimationFrame(() => {
      const newScrollTop = containerRef.current.scrollTop;
      const newScrollLeft = containerRef.current.scrollLeft;
      const scrollingX = newScrollLeft !== scrollLeft;
      const scrollingY = newScrollTop !== scrollTop;
      if (scrollingX)
        scrollXHandler(newScrollLeft);
      if (scrollingY)
        scrollYHandler(newScrollTop);
    });
  };
  import_react.default.useEffect(() => {
    const container = containerRef.current;
    if (!container)
      return;
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutXRef.current)
        clearTimeout(scrollTimeoutXRef.current);
      if (scrollTimeoutYRef.current)
        clearTimeout(scrollTimeoutYRef.current);
    };
  }, [handleScroll]);
  const startIdx = Math.max(
    0,
    // Math.floor(scrollTopRef.current / rowHeight) - dynamicBuffer
    Math.floor(scrollTop / rowHeight) - buffer
  );
  const endIdx = Math.min(
    data.length,
    startIdx + Math.ceil(height / rowHeight) + buffer * 2
  );
  const visibleData = data.slice(startIdx, endIdx);
  const totalHeight = data.length * rowHeight;
  const getContainerStyle = import_react.default.useCallback(
    () => ({ maxHeight: height, height }),
    [height]
  );
  const getListStyle = import_react.default.useCallback(
    () => ({ height: totalHeight, position: "relative" }),
    [totalHeight]
  );
  const getRowStyle = import_react.default.useCallback(
    (index) => ({
      width: "100%",
      height: rowHeight,
      position: "absolute",
      transform: `translateY(${(startIdx + index) * rowHeight}px)`
    }),
    [startIdx, rowHeight]
  );
  return {
    visibleData,
    containerRef,
    endIdx,
    startIdx,
    scrollTop,
    scrollLeft,
    rowHeight,
    totalHeight,
    isScrollingX,
    isScrollingY,
    getListStyle,
    getRowStyle,
    getContainerStyle
  };
};
var use_virtual_list_default = useVirtualized;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useVirtualList
});
