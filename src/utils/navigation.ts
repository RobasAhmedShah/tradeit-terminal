import type { Router, Href } from 'expo-router';

/** Back when the stack allows it; otherwise replace so the user is never stuck. */
export function safeBack(router: Router, fallback: Href) {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace(fallback);
}

/** Leave a legacy redirect route after opening a sheet or similar overlay. */
export function exitLegacyRoute(router: Router, fallback: Href) {
  safeBack(router, fallback);
}
