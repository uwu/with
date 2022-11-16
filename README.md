# with with

A simple way to (almost) use the JavaScript `with` keyword in strict mode!

This is not a sandbox do not use it as a sandbox do not try to make it a sandbox. We will try this and fail so you don't have to.

## Installation

### Node/Bun

```bash
pnpm install with-with
```

### Deno

```ts
import withWith from "https://deno.land/x/with/mod.ts";
```

### QuickJS

Cry.

## Usage

```ts
const inaccessible = true;
withWith({ hello: "there" }, () => () => {
	// You can get types via destructuring like `() => ({ hello, ...etc }) =>`.
	console.log(hello); // Logs `there`.

	/*
	 * Unlike in the real with statement, this will error because inaccessible does not exist within the scope.
	 * Unfortunately it's impossible to replicate this feature.
	 * To get around this, just pass all of the variables you need access to.
	 */
	console.log(inaccessible);
});
```

### Binding

```ts
withWith({ hello: "there" }, () => function () {
	console.log(this);
}, { on: "this" });
```

## Why `() => () =>`?

To get around duplicate variable names in subscopes, some JS engines *cough cough v8* simply rename them and all the references. This breaks the binding to the orginal object when you destructure to make TypeScript happy.

# Windows The Fender

![](./windows_the_fender_11.png)
