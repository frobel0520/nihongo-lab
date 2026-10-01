import { GOOGLE_CLIENT_ID } from '../../lib/sync.mjs';

/**
 * Google 登入（Google Identity Services）。腳本只在使用者按「用 Google 登入」時才載入，
 * 沒有登入就完全不連 Google；拿到的是身分憑證（ID token），交給同步 Worker 驗證。
 */
const SCRIPT_URL = 'https://accounts.google.com/gsi/client?hl=zh-TW';

type CredentialResponse = { credential?: string };

type GoogleIdentity = {
  accounts: {
    id: {
      initialize(config: {
        client_id: string;
        callback: (response: CredentialResponse) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
      }): void;
      renderButton(container: HTMLElement, options: Record<string, unknown>): void;
      disableAutoSelect(): void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

let loading: Promise<void> | null = null;

export function loadGoogleIdentity(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (loading) return loading;
  loading = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loading = null; // 下次可以重試
      script.remove();
      reject(new Error('無法載入 Google 登入，請確認網路連線後再試。'));
    };
    document.head.appendChild(script);
  });
  return loading;
}

/** 在容器裡畫出 Google 官方的登入按鈕；使用者完成登入後以憑證呼叫 onCredential。 */
export function renderGoogleButton(
  container: HTMLElement,
  onCredential: (idToken: string) => void,
) {
  const identity = window.google?.accounts.id;
  if (!identity) throw new Error('Google 登入尚未載入');
  identity.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: (response) => {
      if (response.credential) onCredential(response.credential);
    },
    auto_select: false,
    cancel_on_tap_outside: true,
  });
  container.replaceChildren();
  identity.renderButton(container, {
    type: 'standard',
    theme: 'outline',
    size: 'large',
    text: 'signin_with',
    shape: 'pill',
    logo_alignment: 'left',
  });
}

/** 登出時要求 Google 不要自動用同一個帳號重新登入。 */
export function disableGoogleAutoSelect() {
  window.google?.accounts?.id?.disableAutoSelect();
}
