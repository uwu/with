# with with

A simple way to use the JavaScript `with` statement in strict mode!

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
const accessible = true;
const returnValue = withWith(
	{ hello: "there" },
	() =>
		({ hello }) => {
			// You can get types via destructuring like `() => ({ hello, ...etc }) =>`.

			// This is required to be the FIRST LINE OF CODE for with with to be able to get the contents of this function properly.
			// This line will never actually run in your code.
			// If you have the ability to make it not get removed by a transpiler, you can just use the comment `/*$WITHSTART$*/` instead.
			eval("/*$WITHSTART$*/");

			// Logs `there`.
			console.log("hello", hello);

			// Variables from the parent scope are still accessible.
			console.log("accessible", accessible);

			// You can return as well and it will get passed back to the upper scope.
			return hello;
		},
	// This lifter enables your with wrapped function to be able to access all variables from the parent scope.
	{ lifter: (k) => eval(k) }
);
console.log(returnValue);
```

### Binding

```ts
withWith(
	{ hello: "there" },
	() =>
		function () {
			eval("/*$WITHSTART$*/");
			console.log(this);
		},
	// No variables from the parent scope are accessed, so there's no need for a lifter.
	{ binding: { on: "this" } }
);
```

## Why `() => () =>`?

To get around duplicate variable names in subscopes, some JS engines *cough cough v8* simply rename them and all the references. This breaks the binding to the orginal object when you destructure to make TypeScript happy.

# Windows The Fender

![](https://github.com/uwu/with/blob/master/windows_the_fender_11.png)
