import { useState, useEffect, useMemo, useRef } from "react";
import { useWindowSize } from "../../../../hooks";

interface IVirtualScrollProps {
  data?: any;
  rowComponent?: any;
  rowHeight?: any;
  onEventClick?: any;
  addEvent?: any;
  tolerance?: number;
}

const VirtualScroll = ({
  data,
  rowComponent: Component,
  rowHeight,
  onEventClick,
  addEvent,
  tolerance = 2,
}: IVirtualScrollProps) => {
  const topSpacer: any = useRef();
  const [start, setStart] = useState(0);
  const { height: viewportHeight } = useWindowSize();

  const visibleRowCount = useMemo(
    () => Math.ceil(viewportHeight / rowHeight) + tolerance * 2,
    [viewportHeight, rowHeight, tolerance]
  );

  const dataWithKeys = useMemo(
    () =>
      data.map((elem: any, index: any) => ({
        ...elem,
        key: index,
      })),
    [data]
  );

  const getTopHeight = () => rowHeight * start;
  const getBottomHeight = () =>
    rowHeight * (dataWithKeys.length - (start + visibleRowCount));

  useEffect(() => {
    const onScroll = () => {
      const offsetTop = topSpacer?.current.offsetTop ?? 0;

      const shift = Math.min(
        Math.max(
          0,
          Math.floor((window.scrollY - offsetTop) / rowHeight) - tolerance
        ),
        Math.max(0, dataWithKeys.length - visibleRowCount)
      );

      setStart(shift);
    };

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [dataWithKeys, visibleRowCount, rowHeight, tolerance]);

  return (
    <>
      <div style={{ height: getTopHeight() }} ref={topSpacer} />
      {dataWithKeys
        .slice(start, start + visibleRowCount)
        .map((elem: any) => (
          <Component
            data={elem}
            key={elem.key}
            isLast={elem.key === dataWithKeys.length - 1}
            onEventClick={onEventClick}
            addEvent={addEvent}
            style={{ height: rowHeight }}
          />
        ))}
      <div style={{ height: getBottomHeight() }} />
    </>
  );
};

export default VirtualScroll;
