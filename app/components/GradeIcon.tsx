import type { Grade } from '../../lib/srs.mjs';

/**
 * 單字卡評分圖示：✕（還不會）與 ✓（記得）。純裝飾，文字說明放在按鈕的 aria-label，
 * 所以圖示本身對螢幕閱讀器隱藏。
 */
export function GradeIcon({ grade }: { grade: Grade }) {
  return (
    <svg
      className="grade-icon"
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {grade === 'again' ? (
        <path d="M6 6l12 12M18 6L6 18" />
      ) : (
        <path d="M4.5 12.5l5 5L19.5 7" />
      )}
    </svg>
  );
}
