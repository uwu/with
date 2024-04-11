import assert from "node:assert";
import test from "node:test";

import withWith from "./src/index.ts";

test("lifter", () => {
	const hello = 0;
	let general = "kenobi";
	withWith(
		{ hello: () => "there" },
		() => {
			assert.strictEqual(typeof hello === "function", true);
			// @ts-ignore Arguments must only be for satisfying types.
			assert.strictEqual(hello(), "there");
			// @ts-ignore Arguments must only be for satisfying types.
			assert.strictEqual(general, "kenobi");
			// @ts-ignore Arguments must only be for satisfying types.
			general = "skywalker";
			// @ts-ignore Arguments must only be for satisfying types.
			assert.strictEqual(general, "skywalker");
		},
		{ lifter: (data) => eval(data.eval) }
	);
	assert.strictEqual(hello, 0);
});

test("return value", () => {
	assert.strictEqual(
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

test("binding", () => {
	assert.deepEqual(
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

test("array", () => {
	assert.strictEqual(
		withWith(
			[1, 2, 3],
			() => {
				return toString();
			},
			{ binding: { exists: "yes" } }
		),
		"1,2,3"
	);
});
