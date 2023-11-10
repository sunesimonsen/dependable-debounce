import { observable } from "@dependable/state";

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

  const debouncedSubscribable = () => debouncedObservable();
  debouncedSubscribable.kind = "computed";

  debouncedSubscribable.subscribe = (listener) => {
    if (!active) activate();
    setTimeout(() => {
      debouncedObservable.subscribe(listener);
    }, 0);
    updateActivation();
  };

  debouncedSubscribable.unsubscribe = (listener) => {
    debouncedObservable.unsubscribe(listener);
    updateActivation();
    if (!active) deactivate();
  };

  debouncedSubscribable._registerDependent = (dependent) => {
    if (!active) activate();
    debouncedObservable._registerDependent(dependent);
    updateActivation();
  };

  debouncedSubscribable._unregisterDependent = (dependent) => {
    debouncedObservable._unregisterDependent(dependent);
    updateActivation();
    if (!active) deactivate();
  };

  return debouncedSubscribable;
};
