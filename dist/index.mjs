// src/use-virtual-list.ts
import React from "react";
var SCROLLING_WAIT = 100;
var useVirtualized = ({
  data,
  height,
  rowHeight,
  buffer = 20
}) => {
  const scrollTopRef = React.useRef(0);
  const scrollLeftRef = React.useRef(0);
  const [isScrollingX, setIsScrollingX] = React.useState(false);
  const [isScrollingY, setIsScrollingY] = React.useState(false);
  const containerRef = React.useRef(null);
  const scrollTimeoutXRef = React.useRef(null);
  const scrollTimeoutYRef = React.useRef(null);
  const scrollXHandler = (newScrollLeft) => {
    setIsScrollingX(true);
    scrollLeftRef.current = newScrollLeft;
    if (scrollTimeoutXRef.current) {
      clearTimeout(scrollTimeoutXRef.current);
    }
    scrollTimeoutXRef.current = setTimeout(() => {
      setIsScrollingX(false);
    }, SCROLLING_WAIT);
  };
  const scrollYHandler = (newScrollTop) => {
    setIsScrollingY(true);
    scrollTopRef.current = newScrollTop;
    if (scrollTimeoutYRef.current) {
      clearTimeout(scrollTimeoutYRef.current);
    }
    scrollTimeoutYRef.current = setTimeout(() => {
      setIsScrollingY(false);
    }, SCROLLING_WAIT);
  };
  const handleScroll = React.useCallback(
    (event) => {
      const target = event.target;
      const newScrollTop = target.scrollTop;
      const newScrollLeft = target.scrollLeft;
      const scrollingX = newScrollLeft !== scrollLeftRef.current;
      const scrollingY = newScrollTop !== scrollTopRef.current;
      if (scrollingX) {
        scrollXHandler(newScrollLeft);
      }
      if (scrollingY) {
        scrollYHandler(newScrollTop);
      }
    },
    [scrollLeftRef, scrollTopRef, scrollTimeoutXRef, scrollTimeoutYRef]
  );
  React.useEffect(() => {
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
    Math.floor(scrollTopRef.current / rowHeight) - buffer
  );
  const endIdx = Math.min(
    data.length,
    startIdx + Math.ceil(height / rowHeight) + buffer * 2
  );
  const visibleData = data.slice(startIdx, endIdx);
  const totalHeight = data.length * rowHeight;
  const getContainerStyle = React.useCallback(
    () => ({ maxHeight: height, height }),
    [containerRef, height]
  );
  const getListStyle = React.useCallback(
    () => ({ height: totalHeight, position: "relative" }),
    [totalHeight]
  );
  const getRowStyle = React.useCallback(
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
    // indexes
    endIdx,
    startIdx,
    // scroll positions
    scrollTop: scrollTopRef.current,
    scrollLeft: scrollLeftRef.current,
    // heights
    rowHeight,
    totalHeight,
    // isScrolling
    isScrollingX,
    isScrollingY,
    // props
    getListStyle,
    getRowStyle,
    getContainerStyle
  };
};
var use_virtual_list_default = useVirtualized;
export {
  use_virtual_list_default as useVirtualList
};
