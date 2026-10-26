import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { rememberPageEntry } from '../../lib/page-history.mjs';
import { parseRoute } from '../../lib/route.mjs';

type Entry = {
  id: string;
  hash: string;
  parentHash: string | null;
  values: Record<string, unknown>;
  scrollY: number;
  returning: boolean;
  positioned: boolean;
};
export const PageContext = createContext<Entry | null>(null);
const stateKey = 'nihongoPageEntry';

/** 本分頁、同一次App生命週期的歷史項目；不寫進度／偏好／同步，也不跨重載。 */
export function usePageNavigation() {
  const entries = useRef(new Map<string, Entry>());
  const session = useRef(Math.random().toString(36).slice(2));
  const sequence = useRef(0);
  const fresh = (parentHash: string | null = null): Entry => {
    const id = `${session.current}:${++sequence.current}`;
    const old = history.state;
    history.replaceState(
      { ...(old && typeof old === 'object' ? old : {}), [stateKey]: id },
      '',
    );
    const entry: Entry = {
      id,
      hash: location.hash,
      parentHash,
      values: {},
      scrollY: 0,
      returning: false,
      positioned: false,
    };
    rememberPageEntry(entries.current, entry);
    return entry;
  };
  const [entry, setEntry] = useState(fresh);
  const active = useRef(entry);
  const previousHash = useRef<string | null>(null);
  useEffect(() => {
    const original = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    const capture = () => {
      const current = active.current;
      if (current.positioned && location.hash === current.hash)
        current.scrollY = window.scrollY;
    };
    const navigate = (event: HashChangeEvent) => {
      // 快速前進／返回時舊hashchange仍可能排隊；只處理目前實際所在的項目。
      if (new URL(event.newURL).hash !== location.hash) return;
      const candidate = entries.current.get(history.state?.[stateKey]);
      if (candidate === active.current && candidate.hash === location.hash)
        return;
      const next =
        candidate &&
        candidate.id !== active.current.id &&
        candidate.hash === location.hash
          ? candidate
          : fresh(active.current.hash);
      rememberPageEntry(entries.current, next);
      previousHash.current = next.parentHash;
      next.returning = next === candidate;
      next.positioned = false;
      active.current = next;
      setEntry(next);
    };
    window.addEventListener('scroll', capture, { passive: true });
    // 點擊的預設導航可能先改hash、稍後才送scroll事件；離頁前同步保存實際閱讀位置。
    window.addEventListener('click', capture, true);
    window.addEventListener('hashchange', navigate);
    return () => {
      history.scrollRestoration = original;
      window.removeEventListener('scroll', capture);
      window.removeEventListener('click', capture, true);
      window.removeEventListener('hashchange', navigate);
    };
  }, []);
  return { entry, route: parseRoute(entry.hash), previousHash };
}

export function usePageState<T>(
  key: string,
  initial: T | (() => T),
): [T, Dispatch<SetStateAction<T>>] {
  const entry = useContext(PageContext);
  const [value, setValue] = useState<T>(() =>
    entry && key in entry.values
      ? (entry.values[key] as T)
      : typeof initial === 'function'
        ? (initial as () => T)()
        : initial,
  );
  useLayoutEffect(() => {
    if (entry) entry.values[key] = value;
  }, [entry, key, value]);
  return [value, setValue];
}

/** 放在Suspense內：教材與元件都已掛載後才還原一次，不在一般重繪時搬動閱讀。 */
export function RestorePagePosition({ ready }: { ready: boolean }) {
  const entry = useContext(PageContext);
  useLayoutEffect(() => {
    if (!ready || !entry || entry.positioned) return;
    const view = parseRoute(entry.hash).view;
    // 只讓已掛載的學習卡使用SRS呈現／焦點定位；類別選擇與空牌組仍是一般頁面。
    if (view === 'srs' && document.querySelector('.srs-screen .flashcard')) {
      entry.positioned = true;
      return;
    }
    const top =
      entry.returning &&
      (view === 'lessons' || view === 'dictation' || view === 'srs')
        ? entry.scrollY
        : 0;
    const frame = requestAnimationFrame(() => {
      entry.positioned = true;
      window.scrollTo({ top, behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [entry, ready]);
  return null;
}
