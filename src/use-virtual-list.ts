import React from 'react';
import { flushSync } from 'react-dom';

const SCROLLING_WAIT = 100;

interface Props<T = any> {
  data: T[];
  height: number;
  rowHeight: number;
  buffer?: number;
}

const useVirtualized = <T = any>({
  data,
  height,
  rowHeight,
  buffer = 10,
}: Props<T>) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const [isScrollingX, setIsScrollingX] = React.useState(false);
  const [isScrollingY, setIsScrollingY] = React.useState(false);

  const containerRef = React.useRef<HTMLElement | null>(null);
  const scrollTimeoutXRef = React.useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutYRef = React.useRef<NodeJS.Timeout | null>(null);

  const scrollXHandler = (newScrollLeft: number) => {
    flushSync(() => {
      setIsScrollingX(true);
      setScrollLeft(newScrollLeft);
    });

    if (scrollTimeoutXRef.current) clearTimeout(scrollTimeoutXRef.current);
    scrollTimeoutXRef.current = setTimeout(
      () => setIsScrollingX(false),
      SCROLLING_WAIT
    );
  };

  const scrollYHandler = (newScrollTop: number) => {
    flushSync(() => {
      setIsScrollingY(true);
      setScrollTop(newScrollTop);
    });

    if (scrollTimeoutYRef.current) clearTimeout(scrollTimeoutYRef.current);
    scrollTimeoutYRef.current = setTimeout(
      () => setIsScrollingY(false),
      SCROLLING_WAIT
    );
  };

  const handleScroll = () => {
    if (!containerRef.current) return;

    requestAnimationFrame(() => {
      const newScrollTop = containerRef.current!.scrollTop;
      const newScrollLeft = containerRef.current!.scrollLeft;

      const scrollingX = newScrollLeft !== scrollLeft;
      const scrollingY = newScrollTop !== scrollTop;

      if (scrollingX) scrollXHandler(newScrollLeft);
      if (scrollingY) scrollYHandler(newScrollTop);
    });
  };

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutXRef.current) clearTimeout(scrollTimeoutXRef.current);
      if (scrollTimeoutYRef.current) clearTimeout(scrollTimeoutYRef.current);
    };
  }, [handleScroll]);

  /**
   * startIdx:
   * The starting index of the visible items in the list.
   */
  const startIdx = Math.max(
    0,
    // Math.floor(scrollTopRef.current / rowHeight) - dynamicBuffer
    Math.floor(scrollTop / rowHeight) - buffer
  );

  /**
   * endIdx:
   * The ending index of the visible items in the list.
   */
  const endIdx = Math.min(
    data.length,
    startIdx + Math.ceil(height / rowHeight) + buffer * 2
  );

  const visibleData = data.slice(startIdx, endIdx);
  const totalHeight = data.length * rowHeight;

  /**
   * Get styles for container, list, and rows
   */
  const getContainerStyle = React.useCallback(
    () => ({ maxHeight: height, height }),
    [height]
  );
  const getListStyle = React.useCallback(
    () => ({ height: totalHeight, position: 'relative' } as const),
    [totalHeight]
  );
  const getRowStyle = React.useCallback(
    (index: number) =>
      ({
        width: '100%',
        height: rowHeight,
        position: 'absolute',
        transform: `translateY(${(startIdx + index) * rowHeight}px)`,
      } as const),
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
    getContainerStyle,
  };
};

export default useVirtualized;
