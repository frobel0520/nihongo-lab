import { Component, Suspense, type ReactNode } from 'react';
class ImportBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <section className="card" role="alert">
        <p>教材載入失敗。離線時請先確認已下載教材；連線後可重新載入。</p>
        <button className="btn" onClick={() => window.location.reload()}>
          重新載入
        </button>
      </section>
    ) : (
      this.props.children
    );
  }
}
export function LoadBoundary({ children }: { children: ReactNode }) {
  return (
    <ImportBoundary>
      <Suspense fallback={<output className="notice">正在載入教材…</output>}>
        {children}
      </Suspense>
    </ImportBoundary>
  );
}
