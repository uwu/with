import { assertEquals } from "https://deno.land/std@0.220.0/assert/assert_equals.ts";

import withWith from "./src/index.ts";

Deno.test("lifter", () => {
	const hello = 0;
	let general = "kenobi";
	withWith(
		{ hello: () => "there" },
		() => {
			// @ts-ignore Arguments must only be for satisfying types.
			assertEquals(typeof hello === "function", true);
			// @ts-ignore Arguments must only be for satisfying types.
			assertEquals(hello(), "there");
			// @ts-ignore Arguments must only be for satisfying types.
			assertEquals(general, "kenobi");
			// @ts-ignore Arguments must only be for satisfying types.
			general = "skywalker";
			// @ts-ignore Arguments must only be for satisfying types.
			assertEquals(general, "skywalker");
		},
		{ lifter: (data) => eval(data.eval) }
	);
	assertEquals(hello, 0);
});

Deno.test("return value", () => {
	assertEquals(
		withWith(
			{ value: () => 2 + 2 },
			({ value }) => {
				return value();
			},
			{ lifter: (data) => eval(data.eval) }
		),
		4
	);
});

Deno.test("binding", () => {
	assertEquals(
		withWith(
			{},
			function () {
				return this;
			},
			{ binding: { exists: "yes" } }
		),
		{ exists: "yes" }
	);
});

Deno.test("array", () => {
	assertEquals(
		withWith(
			[1, 2, 3],
			() => {
				// @ts-ignore Arguments must only be for satisfying types.
				return toString();
			},
			{ binding: { exists: "yes" } }
		),
		"1,2,3"
	);
});
