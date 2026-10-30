import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
  type AnchorHTMLAttributes,
  type ReactNode,
  type DetailsHTMLAttributes,
} from 'react';
import { pageReturnDelta, rememberPageEntry } from '../../lib/page-history.mjs';
import { backNavigation, parseRoute } from '../../lib/route.mjs';

type Entry = {
  id: string;
  hash: string;
  parentHash: string | null;
  parentId: string | null;
  position: number;
  values: Record<string, unknown>;
  scrollY: number;
  returning: boolean;
  positioned: boolean;
};
export const PageContext = createContext<Entry | null>(null);
export const NavigationContext = createContext<
  ((fallback: string, previous?: boolean) => void) | null
>(null);

export function PageProvider({
  entry,
  back,
  children,
}: {
  entry: Entry;
  back: (fallback: string, previous?: boolean) => void;
  children: ReactNode;
}) {
  return (
    <NavigationContext.Provider value={back}>
      <PageContext.Provider value={entry}>{children}</PageContext.Provider>
    </NavigationContext.Provider>
  );
}

/** Semantic parent links return to a retained ancestor; direct links replace
 * safely inside the App. Modified clicks retain normal anchor behaviour. */
export function BackLink({
  href = '#/',
  onClick,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const back = useContext(NavigationContext);
  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.altKey ||
          event.shiftKey
        )
          return;
        event.preventDefault();
        if (back) back(href);
        else window.location.replace(href);
      }}
    >
      {children}
    </a>
  );
}

export function PageDetails({
  stateKey,
  scope,
  children,
  onToggle,
  ...props
}: Omit<DetailsHTMLAttributes<HTMLDetailsElement>, 'open'> & {
  stateKey: string;
  scope?: string;
}) {
  const [open, setOpen] = usePageState(stateKey, false, scope);
  return (
    <details
      {...props}
      open={open}
      onToggle={(event) => {
        setOpen(event.currentTarget.open);
        onToggle?.(event);
      }}
    >
      {children}
    </details>
  );
}
const stateKey = 'nihongoPageEntry';

/** 本分頁、同一次App生命週期的歷史項目；不寫進度／偏好／同步，也不跨重載。 */
export function usePageNavigation() {
  const entries = useRef(new Map<string, Entry>());
  const session = useRef(Math.random().toString(36).slice(2));
  const sequence = useRef(0);
  const replacing = useRef(false);
  const fresh = (parent: Entry | null = null): Entry => {
    const id = `${session.current}:${++sequence.current}`;
    const old = history.state;
    history.replaceState(
      { ...(old && typeof old === 'object' ? old : {}), [stateKey]: id },
      '',
    );
    const entry: Entry = {
      id,
      hash: location.hash,
      parentHash: parent?.hash ?? null,
      parentId: parent?.id ?? null,
      position: parent ? parent.position + 1 : 0,
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
    const navigate = (event: HashChangeEvent | PopStateEvent) => {
      // 快速前進／返回時舊hashchange仍可能排隊；只處理目前實際所在的項目。
      if ('newURL' in event && new URL(event.newURL).hash !== location.hash)
        return;
      const candidate = entries.current.get(history.state?.[stateKey]);
      if (candidate === active.current && candidate.hash === location.hash)
        return;
      const next =
        candidate &&
        candidate.id !== active.current.id &&
        candidate.hash === location.hash
          ? candidate
          : fresh(
              replacing.current || history.state?.[stateKey]
                ? null
                : active.current,
            );
      replacing.current = false;
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
    window.addEventListener('popstate', navigate);
    return () => {
      history.scrollRestoration = original;
      window.removeEventListener('scroll', capture);
      window.removeEventListener('click', capture, true);
      window.removeEventListener('hashchange', navigate);
      window.removeEventListener('popstate', navigate);
    };
  }, []);
  const back = (fallback: string, previous = false) => {
    if (!fallback.startsWith('#/')) fallback = '#/';
    const current = active.current;
    if (current.positioned) current.scrollY = window.scrollY;
    const delta = pageReturnDelta(
      entries.current,
      current,
      (parent) => previous || backNavigation(parent.hash, fallback) === 'back',
    );
    if (delta !== null) history.go(delta);
    else {
      replacing.current = true;
      window.location.replace(fallback);
    }
  };
  return { entry, route: parseRoute(entry.hash), previousHash, back };
}

export function usePageState<T>(
  key: string,
  initial: T | (() => T),
  scope?: string,
): [T, Dispatch<SetStateAction<T>>] {
  const entry = useContext(PageContext);
  const [value, setValue] = useState<T>(() => {
    const stored = entry?.values[key];
    if (scope === undefined && entry && key in entry.values) return stored as T;
    if (
      scope !== undefined &&
      stored &&
      typeof stored === 'object' &&
      'scope' in stored &&
      stored.scope === scope &&
      'value' in stored
    )
      return stored.value as T;
    return typeof initial === 'function' ? (initial as () => T)() : initial;
  });
  useLayoutEffect(() => {
    if (entry)
      entry.values[key] = scope === undefined ? value : { scope, value };
  }, [entry, key, value, scope]);
  return [value, setValue];
}

/** 放在Suspense內：教材與元件都已掛載後才還原一次，不在一般重繪時搬動閱讀。 */
export function RestorePagePosition({ ready }: { ready: boolean }) {
  const entry = useContext(PageContext);
  useLayoutEffect(() => {
    if (!ready || !entry || entry.positioned) return;
    // Suspense + route readiness reserve the full content layout (portraits and
    // illustrations have explicit dimensions). One commit-time restoration;
    // SRS subsequent presentations keep their own focus/scroll protocol.
    const top = entry.returning ? entry.scrollY : 0;
    entry.positioned = true;
    window.scrollTo({ top, behavior: 'instant' });
  }, [entry, ready]);
  return null;
}
