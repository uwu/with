# with with

A simple way to use the JavaScript `with` statement in strict mode!

This is not a sandbox do not use it as a sandbox do not try to make it a sandbox. ~~We will try this and fail so you don't have to.~~

Please don't use this in production... Or out of production... We just love doing things that make TC39 hire hitmen.

## Installation

### Node

```bash
pnpm i with-with
```

### Deno

```ts
import withWith from "https://deno.land/x/with/mod.ts";
```

### Bun

```bash
bun i with-with
```

### QuickJS

Cry.

## Usage

```ts
let accessible = false;
const returnValue = withWith(
	{ hello: "there" },
	({ hello }) => {
		// You can get types via destructuring like `({ hello, etc }) =>`.
		// Destructuring is not required to access anything.

		// Logs `there`.
		console.log("hello", hello);

		// Variables from the parent scope are still accessible and can be mutated.
		accessible = true;

		// You can return as well and it will get passed back to the upper scope.
		return hello;
	},
	// This lifter enables your `with` wrapped function to be able to access all variables from the parent scope.
	{ lifter: (data) => eval(data.eval) }
);
console.log(returnValue, accessible);
```

### Binding

```ts
withWith(
	{ hello: "there" },
	function () {
		console.log(this);
	},
	// No variables from the parent scope are accessed, so there's no need for a lifter.
	{ binding: { on: "this" } }
);
```
