import { useEffect, useRef, type MouseEvent, type PointerEvent } from 'react';
import { swipeStep } from '../../lib/swipe.mjs';

export function useSwipeNavigation(previous: () => void, next: () => void) {
  const container = useRef<HTMLDivElement>(null);
  const start = useRef<{ id: number; x: number; y: number; at: number } | null>(
    null,
  );
  const suppressClickUntil = useRef(0);
  const pendingNavigation = useRef<number | null>(null);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const handleTouchMove = (event: TouchEvent) => {
      const origin = start.current;
      if (!origin || event.touches.length !== 1) return;
      const touch = event.touches[0];
      const dx = touch.clientX - origin.x;
      const dy = touch.clientY - origin.y;
      if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.5)
        event.preventDefault();
    };
    // Cancel only the horizontal gesture we handle, retaining native scrolling
    // and preventing a browser fling from swallowing the following button tap.
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => element.removeEventListener('touchmove', handleTouchMove);
  }, [previous, next]);
  useEffect(
    () => () => {
      if (pendingNavigation.current !== null)
        cancelAnimationFrame(pendingNavigation.current);
    },
    [],
  );
  return {
    ref: container,
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      suppressClickUntil.current = 0;
      start.current = null;
      if (!event.isPrimary || event.button !== 0) {
        start.current = null;
        return;
      }
      const target = event.target instanceof Element ? event.target : null;
      if (
        target?.closest(
          'input, textarea, select, a, [contenteditable]:not([contenteditable="false"]), [data-no-swipe]',
        )
      )
        return;
      // 留下兩側的瀏覽器返回／前進手勢。
      if (event.clientX < 24 || event.clientX > window.innerWidth - 24) return;
      start.current = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        at: performance.now(),
      };
    },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      const origin = start.current;
      if (!origin || origin.id !== event.pointerId) return;
      const dx = event.clientX - origin.x;
      const dy = event.clientY - origin.y;
      if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) {
        start.current = null;
        return;
      }
      if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    },
    onPointerUp: (event: PointerEvent<HTMLElement>) => {
      const origin = start.current;
      start.current = null;
      if (!origin || origin.id !== event.pointerId) return;
      const direction = swipeStep(
        event.clientX - origin.x,
        event.clientY - origin.y,
        performance.now() - origin.at,
      );
      if (!direction) return;
      suppressClickUntil.current = performance.now() + 500;
      // Finish touchend before replacing its original target, so the next tap
      // still receives its normal click event on mobile browsers.
      pendingNavigation.current = requestAnimationFrame(() => {
        pendingNavigation.current = null;
        if (direction === 1) next();
        else previous();
      });
    },
    onPointerCancel: () => {
      start.current = null;
    },
    onLostPointerCapture: (event: PointerEvent<HTMLElement>) => {
      // Touch starts with implicit capture on the child; transferring it to
      // this container also bubbles a lost-capture event from that child.
      if (event.target === event.currentTarget) start.current = null;
    },
    onClickCapture: (event: MouseEvent<HTMLElement>) => {
      if (event.detail > 0 && performance.now() < suppressClickUntil.current) {
        suppressClickUntil.current = 0;
        event.preventDefault();
        event.stopPropagation();
      }
    },
  };
}
