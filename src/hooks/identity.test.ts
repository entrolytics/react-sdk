import { describe, expect, it } from 'vite-plus/test';

import { generateUuid, getOrCreateVisitorId } from './identity';

describe('privacy-preserving identity', () => {
  it('returns a valid UUID', () => {
    expect(generateUuid()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('keeps only an in-memory visitor identifier for the current day', () => {
    expect(getOrCreateVisitorId()).toBe(getOrCreateVisitorId());
  });
});
