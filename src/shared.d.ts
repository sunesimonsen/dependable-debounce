export type { Subscribable } from "@dependable/state/types/shared.d";

import type { Subscribable } from "@dependable/state/types/shared.d";

/**
 * A debounced computed value that can be subscribed to.
 * It makes a delayed update whenever any of its dependencies updates.
 *
 * @template T the type of the computed value.
 */
export type DebouncedComputed<T> = Subscribable & {
  /**
   * Get the value of the computed.
   *
   * @returns the value of the computed.
   */
  (): T;
};
