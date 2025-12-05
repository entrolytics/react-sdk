import { useEntrolyticsContext } from '../context.js';

/**
 * Main hook for accessing Entrolytics functionality
 *
 * Returns all tracking methods and configuration
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { track, identify, config, isLoaded } = useEntrolytics();
 *
 *   return (
 *     <button onClick={() => track('button_click', { variant: 'primary' })}>
 *       Click me
 *     </button>
 *   );
 * }
 * ```
 */
export function useEntrolytics() {
  return useEntrolyticsContext();
}
