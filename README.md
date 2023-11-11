# @dependable/debounce

[![Checks](https://github.com/sunesimonsen/dependable-debounce/workflows/CI/badge.svg)](https://github.com/sunesimonsen/dependable-debounce/actions?query=workflow%3ACI+branch%3Amain)
[![Bundle Size](https://img.badgesize.io/https:/unpkg.com/@dependable/debounce/dist/dependable-debounce.esm.min.js?label=gzip&compression=gzip)](https://unpkg.com/@dependable/debounce/dist/dependable-debounce.esm.min.js)

Debouncing [@dependable/state](https://github.com/sunesimonsen/dependable-state) subscribables.

[API documentation](https://dependable-debounce-api.surge.sh/modules/debounce.html)

## Install

```sh
# npm
npm install --save @dependable/debounce

# yarn
yarn add @dependable/debounce
```

## Usage

### Debouncing an observable

You can create a debounced version of an observable to following way:

```js
import { debounce } from "@dependable/debounce";
import { observable } from "@dependable/state";

const searchText = observable("");
const debouncedSearchText = debounce(searchText, 300);
```

Now all updates to `searchText` will be debounced 300ms and cause a delayed update to `debouncedSearchText`.

This is useful when you need to create instants search, where you only want to query the server after a delay.

### Debouncing a computed

Similar to how you can debounce an observable, you can also debounce computeds:

```js
import { debounce } from "@dependable/debounce";
import { observable, computed } from "@dependable/state";

const searchText = observable("");
const upperCaseSearchText = computed(() => searchText().toUpperCase());
const debouncedUpperCaseSearchText = debounce(upperCaseSearchText, 300);
```
