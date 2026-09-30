import type { ReactNode } from 'react';

/**
 * 介面圖示（24×24 線條圖示，顏色跟隨文字色）。裝飾用，文字說明由旁邊的標籤或 aria-label 提供，
 * 所以圖示本身 aria-hidden。
 */
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export const BookIcon = () => (
  <Icon>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
    <path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" />
    <path d="M9 8h7" />
  </Icon>
);

export const CardsIcon = () => (
  <Icon>
    <rect x="3" y="7" width="14" height="13" rx="2.5" />
    <path d="M7 7V5.5A2.5 2.5 0 0 1 9.5 3h9A2.5 2.5 0 0 1 21 5.5v8a2.5 2.5 0 0 1-2.5 2.5H17" />
  </Icon>
);

export const HeadphonesIcon = () => (
  <Icon>
    <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
    <rect x="3" y="14" width="4" height="7" rx="1.5" />
    <rect x="17" y="14" width="4" height="7" rx="1.5" />
  </Icon>
);

export const MicIcon = () => (
  <Icon>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0" />
    <path d="M12 18v3" />
  </Icon>
);

export const SlidersIcon = () => (
  <Icon>
    <path d="M4 7h9M19 7h1M4 17h1M11 17h9" />
    <circle cx="16" cy="7" r="2.5" />
    <circle cx="8" cy="17" r="2.5" />
  </Icon>
);

export const BackIcon = () => (
  <Icon>
    <path d="M15 5l-7 7 7 7" />
  </Icon>
);

export const ChevronRightIcon = () => (
  <Icon>
    <path d="M9 5l7 7-7 7" />
  </Icon>
);

export const PlayIcon = () => (
  <svg
    className="icon"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
  </svg>
);

export const StopIcon = () => (
  <svg
    className="icon"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <rect x="6" y="6" width="12" height="12" rx="2.5" />
  </svg>
);

export const SpeakerIcon = () => (
  <Icon>
    <path d="M4 10v4h4l5 4V6L8 10z" />
    <path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11" />
  </Icon>
);

export const CheckIcon = () => (
  <Icon>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
);

export const CloseIcon = () => (
  <Icon>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);

export const PrevIcon = () => (
  <Icon>
    <path d="M6 5v14M19 5.5v13L9 12z" />
  </Icon>
);

export const NextIcon = () => (
  <Icon>
    <path d="M18 5v14M5 5.5v13L15 12z" />
  </Icon>
);
