import { useCallback, useEffect, useRef } from 'react';
import { useEntrolyticsContext } from '../context.js';

export type FormEventType =
  | 'start'
  | 'field_focus'
  | 'field_blur'
  | 'field_error'
  | 'submit'
  | 'abandon';

export interface FormEventData {
  /** Form event type */
  eventType: FormEventType;
  /** Form identifier (ID attribute or generated) */
  formId: string;
  /** Human-readable form name */
  formName?: string;
  /** Page path where form exists */
  urlPath?: string;
  /** Field name (for field events) */
  fieldName?: string;
  /** Field type (text, email, select, etc.) */
  fieldType?: string;
  /** Field position in form (0-indexed) */
  fieldIndex?: number;
  /** Time spent on field (ms) */
  timeOnField?: number;
  /** Time since form start (ms) */
  timeSinceStart?: number;
  /** Error message (for field_error events) */
  errorMessage?: string;
  /** Whether submission was successful (for submit events) */
  success?: boolean;
}

export interface UseFormTrackingOptions {
  /** Form ID to track */
  formId: string;
  /** Human-readable form name */
  formName?: string;
  /** Auto-track field interactions (default: true) */
  autoTrack?: boolean;
  /** Track field-level timing (default: true) */
  trackTiming?: boolean;
  /** Detect form abandonment (default: true) */
  trackAbandonment?: boolean;
}

interface FormState {
  startTime: number | null;
  fieldStartTimes: Map<string, number>;
  hasInteracted: boolean;
  lastFieldName: string | null;
}

/**
 * Hook for tracking form interactions
 *
 * @example
 * // Automatic form tracking
 * import { useFormTracking } from '@entrolytics/react';
 *
 * function SignupForm() {
 *   const { formRef, trackSubmit } = useFormTracking({
 *     formId: 'signup-form',
 *     formName: 'Newsletter Signup'
 *   });
 *
 *   const handleSubmit = async (e) => {
 *     e.preventDefault();
 *     const success = await submitForm();
 *     trackSubmit(success);
 *   };
 *
 *   return (
 *     <form ref={formRef} onSubmit={handleSubmit}>
 *       <input name="email" type="email" />
 *       <button type="submit">Subscribe</button>
 *     </form>
 *   );
 * }
 *
 * @example
 * // Manual tracking
 * const { trackEvent } = useFormTracking({ formId: 'my-form', autoTrack: false });
 *
 * trackEvent({ eventType: 'field_focus', fieldName: 'email' });
 */
export function useFormTracking(options: UseFormTrackingOptions) {
  const {
    formId,
    formName,
    autoTrack = true,
    trackTiming = true,
    trackAbandonment = true,
  } = options;
  const { config } = useEntrolyticsContext();
  const formRef = useRef<HTMLFormElement | null>(null);
  const stateRef = useRef<FormState>({
    startTime: null,
    fieldStartTimes: new Map(),
    hasInteracted: false,
    lastFieldName: null,
  });

  const trackEvent = useCallback(
    async (
      data: Omit<FormEventData, 'formId' | 'formName' | 'urlPath'> &
        Partial<Pick<FormEventData, 'formId' | 'formName' | 'urlPath'>>,
    ) => {
      if (typeof window === 'undefined') return;

      const host = config.host || 'https://entrolytics.click';
      const payload: FormEventData = {
        formId: data.formId || formId,
        formName: data.formName || formName,
        urlPath: data.urlPath || window.location.pathname,
        ...data,
      };

      try {
        await fetch(`${host}/api/collect/forms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            website: config.websiteId,
            ...payload,
          }),
          keepalive: true,
        });
      } catch (err) {
        console.error('[Entrolytics] Failed to track form event:', err);
      }
    },
    [config.websiteId, config.host, formId, formName],
  );

  const trackStart = useCallback(() => {
    if (stateRef.current.startTime !== null) return; // Already started
    stateRef.current.startTime = Date.now();
    trackEvent({ eventType: 'start' });
  }, [trackEvent]);

  const trackFieldFocus = useCallback(
    (fieldName: string, fieldType?: string, fieldIndex?: number) => {
      const state = stateRef.current;

      // Track start on first interaction
      if (!state.hasInteracted) {
        state.hasInteracted = true;
        trackStart();
      }

      // Record field start time for timing
      if (trackTiming) {
        state.fieldStartTimes.set(fieldName, Date.now());
      }

      state.lastFieldName = fieldName;

      trackEvent({
        eventType: 'field_focus',
        fieldName,
        fieldType,
        fieldIndex,
        timeSinceStart: state.startTime ? Date.now() - state.startTime : undefined,
      });
    },
    [trackEvent, trackStart, trackTiming],
  );

  const trackFieldBlur = useCallback(
    (fieldName: string, fieldType?: string, fieldIndex?: number) => {
      const state = stateRef.current;
      const fieldStartTime = state.fieldStartTimes.get(fieldName);
      const timeOnField = fieldStartTime ? Date.now() - fieldStartTime : undefined;

      trackEvent({
        eventType: 'field_blur',
        fieldName,
        fieldType,
        fieldIndex,
        timeOnField,
        timeSinceStart: state.startTime ? Date.now() - state.startTime : undefined,
      });
    },
    [trackEvent],
  );

  const trackFieldError = useCallback(
    (fieldName: string, errorMessage: string, fieldType?: string, fieldIndex?: number) => {
      trackEvent({
        eventType: 'field_error',
        fieldName,
        fieldType,
        fieldIndex,
        errorMessage,
        timeSinceStart: stateRef.current.startTime
          ? Date.now() - stateRef.current.startTime
          : undefined,
      });
    },
    [trackEvent],
  );

  const trackSubmit = useCallback(
    (success: boolean) => {
      trackEvent({
        eventType: 'submit',
        success,
        timeSinceStart: stateRef.current.startTime
          ? Date.now() - stateRef.current.startTime
          : undefined,
      });

      // Reset state after submit
      stateRef.current = {
        startTime: null,
        fieldStartTimes: new Map(),
        hasInteracted: false,
        lastFieldName: null,
      };
    },
    [trackEvent],
  );

  const trackAbandon = useCallback(() => {
    if (!stateRef.current.hasInteracted) return; // Only track if user interacted

    trackEvent({
      eventType: 'abandon',
      fieldName: stateRef.current.lastFieldName || undefined,
      timeSinceStart: stateRef.current.startTime
        ? Date.now() - stateRef.current.startTime
        : undefined,
    });
  }, [trackEvent]);

  // Auto-track field interactions
  useEffect(() => {
    if (!autoTrack || !formRef.current) return;

    const form = formRef.current;

    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      if (!target.name && !target.id) return;

      const fieldName = target.name || target.id;
      const fieldType = target.type || target.tagName.toLowerCase();
      const fields = Array.from(form.elements);
      const fieldIndex = fields.indexOf(target);

      trackFieldFocus(fieldName, fieldType, fieldIndex >= 0 ? fieldIndex : undefined);
    };

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      if (!target.name && !target.id) return;

      const fieldName = target.name || target.id;
      const fieldType = target.type || target.tagName.toLowerCase();
      const fields = Array.from(form.elements);
      const fieldIndex = fields.indexOf(target);

      trackFieldBlur(fieldName, fieldType, fieldIndex >= 0 ? fieldIndex : undefined);
    };

    form.addEventListener('focusin', handleFocus);
    form.addEventListener('focusout', handleBlur);

    return () => {
      form.removeEventListener('focusin', handleFocus);
      form.removeEventListener('focusout', handleBlur);
    };
  }, [autoTrack, trackFieldFocus, trackFieldBlur]);

  // Track abandonment on page unload
  useEffect(() => {
    if (!trackAbandonment) return;

    const handleBeforeUnload = () => {
      if (stateRef.current.hasInteracted && stateRef.current.startTime) {
        trackAbandon();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [trackAbandonment, trackAbandon]);

  return {
    formRef,
    trackEvent,
    trackStart,
    trackFieldFocus,
    trackFieldBlur,
    trackFieldError,
    trackSubmit,
    trackAbandon,
  };
}
