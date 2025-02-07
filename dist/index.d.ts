import React from 'react';

interface Props<T = any> {
    data: T[];
    height: number;
    rowHeight: number;
    buffer?: number;
}
declare const useVirtualized: <T = any>({ data, height, rowHeight, buffer, }: Props<T>) => {
    visibleData: T[];
    containerRef: React.MutableRefObject<HTMLElement | null>;
    endIdx: number;
    startIdx: number;
    scrollTop: number;
    scrollLeft: number;
    rowHeight: number;
    totalHeight: number;
    isScrollingX: boolean;
    isScrollingY: boolean;
    getListStyle: () => {
        readonly height: number;
        readonly position: "relative";
    };
    getRowStyle: (index: number) => {
        readonly width: "100%";
        readonly height: number;
        readonly position: "absolute";
        readonly transform: `translateY(${number}px)`;
    };
    getContainerStyle: () => {
        maxHeight: number;
        height: number;
    };
};

export { useVirtualized as useVirtualList };
