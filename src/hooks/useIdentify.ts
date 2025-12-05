import { useCallback } from 'react';
import type { EventData } from '../context.js';
import { useEntrolyticsContext } from '../context.js';

/**
 * Hook for identifying users
 *
 * Call this when a user logs in or their information changes
 *
 * @example
 * ```tsx
 * function UserIdentifier({ user }) {
 *   const identify = useIdentify();
 *
 *   useEffect(() => {
 *     if (user) {
 *       identify(user.id, {
 *         email: user.email,
 *         plan: user.plan
 *       });
 *     }
 *   }, [user, identify]);
 *
 *   return null;
 * }
 * ```
 */
export function useIdentify() {
  const { identifyUser } = useEntrolyticsContext();

  return useCallback(
    (userId: string, traits?: EventData) => {
      identifyUser(userId, traits);
    },
    [identifyUser],
  );
}
