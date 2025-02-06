import React from 'react';

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
  buffer = 20,
}: Props<T>) => {
  const scrollTopRef = React.useRef(0);
  const scrollLeftRef = React.useRef(0);
  const [isScrollingX, setIsScrollingX] = React.useState(false);
  const [isScrollingY, setIsScrollingY] = React.useState(false);

  const containerRef = React.useRef<HTMLElement | null>(null);
  const scrollTimeoutXRef = React.useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutYRef = React.useRef<NodeJS.Timeout | null>(null);

  const scrollXHandler = (newScrollLeft: number) => {
    setIsScrollingX(true);
    // setScrollLeft(newScrollLeft);
    scrollLeftRef.current = newScrollLeft;

    if (scrollTimeoutXRef.current) {
      clearTimeout(scrollTimeoutXRef.current);
    }

    scrollTimeoutXRef.current = setTimeout(() => {
      setIsScrollingX(false);
    }, SCROLLING_WAIT);
  };

  const scrollYHandler = (newScrollTop: number) => {
    setIsScrollingY(true);
    // setScrollTop(newScrollTop);
    scrollTopRef.current = newScrollTop;

    if (scrollTimeoutYRef.current) {
      clearTimeout(scrollTimeoutYRef.current);
    }

    scrollTimeoutYRef.current = setTimeout(() => {
      setIsScrollingY(false);
    }, SCROLLING_WAIT);
  };

  const handleScroll = React.useCallback(
    (event: Event) => {
      const target = event.target as HTMLElement;

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
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });

    // initialize scroll
    // setScrollTop(container.scrollTop);
    // setScrollLeft(container.scrollLeft);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutXRef.current) clearTimeout(scrollTimeoutXRef.current);
      if (scrollTimeoutYRef.current) clearTimeout(scrollTimeoutYRef.current);
    };
  }, [handleScroll]);

  /**
   * startIdx:
   * The starting index of the visible items in the list.
   * Calculated based on the current `scrollTop` position.
   * The buffer ensures that additional items are rendered before they come into view,
   * reducing the chance of flickering during fast scrolling.
   */
  const startIdx = Math.max(
    0,
    Math.floor(scrollTopRef.current / rowHeight) - buffer
  );

  /**
   * endIdx:
   * The ending index of the visible items in the list.
   * It ensures that only the necessary items are rendered based on the available viewport height.
   * The buffer * 2 allows rendering a few extra items below the viewport to ensure a smooth scrolling experience.
   */
  const endIdx = Math.min(
    data.length,
    startIdx + Math.ceil(height / rowHeight) + buffer * 2
  );

  const visibleData = data.slice(startIdx, endIdx);

  const totalHeight = data.length * rowHeight;

  /**
   * scrollContainerProps:
   * Props for the outermost scrollable container.
   * - `maxHeight`: Restricts the height to avoid excessive scrolling.
   * - `height`: Defines the height of the scrollable area.
   */
  const getContainerStyle = React.useCallback(
    () => ({ maxHeight: height, height }),
    [containerRef, height]
  );

  /**
   * listContainerProps:
   * Props for the list wrapper container.
   * - `height`: Matches the total height of all items to maintain scroll position accuracy.
   */
  const getListStyle = React.useCallback(
    () => ({ height: totalHeight, position: 'relative' } as const),
    [totalHeight]
  );

  /**
   * itemProps:
   * Props for each individual list item.
   * - `height`: Ensures each item maintains a consistent height.
   */
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
    getContainerStyle,
  };
};

export default useVirtualized;
