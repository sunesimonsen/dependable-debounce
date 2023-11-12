import { observable, computed } from "@dependable/state";

const g = globalThis;
const setTimeout = g.setTimeout;
const clearTimeout = g.clearTimeout;

/**
 * Creating a new debounced computed based on the given subscribable.
 *
 * @template T
 * @param {import('./shared.d').Subscribable} input The subscribable to debounce
 * @param {number} delayMS The delay in miliseconds
 * @returns {import('./shared.d').DebouncedComputed<T>} The debounced value
 */
export const debounce = (input, delayMS) => {
  const debouncedObservable = observable(input());

  let timeout;
  const debouncedUpdate = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => debouncedObservable(input()), delayMS);
  };

  const activate = () => {
    debouncedObservable(input());
    input.subscribe(debouncedUpdate);
  };

  const deactivate = () => {
    clearTimeout(timeout);
    input.unsubscribe(debouncedUpdate);
  };

  let active = false;
  const updateActivation = () => {
    active =
      debouncedObservable._dependents.size > 0 ||
      debouncedObservable._subscribers.size > 0;
  };

  const debouncedSubscribable = computed(() => debouncedObservable());

  const originalSubscribe = debouncedSubscribable.subscribe;

  debouncedSubscribable.subscribe = (listener) => {
    if (!active) activate();
    originalSubscribe(listener);
    updateActivation();
  };

  const originalUnsubscribe = debouncedSubscribable.unsubscribe;

  debouncedSubscribable.unsubscribe = (listener) => {
    originalUnsubscribe(listener);
    updateActivation();
    if (!active) deactivate();
  };

  const originalRegisterDependent = debouncedSubscribable._registerDependent;

  debouncedSubscribable._registerDependent = (dependent) => {
    if (!active) activate();
    originalRegisterDependent(dependent);
    updateActivation();
  };

  const originalUnregisterDependent =
    debouncedSubscribable._unregisterDependent;

  debouncedSubscribable._unregisterDependent = (dependent) => {
    originalUnregisterDependent(dependent);
    updateActivation();
    if (!active) deactivate();
  };

  return debouncedSubscribable;
};
