export const AUTH_TOKEN_CHANGED_EVENT = "auth-token-changed";

export type AuthTokenChangedDetail = {
  accessToken: string | null;
  refreshToken: string | null;
};

export function getAuthTokenChangedDetail(): AuthTokenChangedDetail {
  if (typeof window === "undefined") {
    return {
      accessToken: null,
      refreshToken: null,
    };
  }

  return {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  };
}

export function dispatchAuthTokenChanged() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<AuthTokenChangedDetail>(AUTH_TOKEN_CHANGED_EVENT, {
      detail: getAuthTokenChangedDetail(),
    }),
  );
}

export function subscribeAuthTokenChanged(
  callback: (detail: AuthTokenChangedDetail) => void,
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleTokenChanged = (event: Event) => {
    const customEvent = event as CustomEvent<AuthTokenChangedDetail>;
    callback(customEvent.detail ?? getAuthTokenChangedDetail());
  };

  const handleStorageChanged = (event: StorageEvent) => {
    if (
      event.key === "accessToken" ||
      event.key === "refreshToken" ||
      event.key === null
    ) {
      callback(getAuthTokenChangedDetail());
    }
  };

  window.addEventListener(AUTH_TOKEN_CHANGED_EVENT, handleTokenChanged);
  window.addEventListener("storage", handleStorageChanged);

  return () => {
    window.removeEventListener(AUTH_TOKEN_CHANGED_EVENT, handleTokenChanged);
    window.removeEventListener("storage", handleStorageChanged);
  };
}
