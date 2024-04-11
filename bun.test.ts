import { expect, test } from "bun:test";
import withWith from "./src/index.ts";

test("lifter", () => {
	const hello = 0;
	let general = "kenobi";
	withWith(
		{ hello: () => "there" },
		({ hello }) => {
			expect(hello).toBeFunction();
			// @ts-ignore Arguments must only be for satisfying types.
			expect(hello()).toBe("there");
			// @ts-ignore Arguments must only be for satisfying types.
			expect(general).toBe("kenobi");
			// @ts-ignore Arguments must only be for satisfying types.
			general = "skywalker";
			// @ts-ignore Arguments must only be for satisfying types.
			expect(general).toBe("skywalker");
		},
		{ lifter: (data) => eval(data.eval) }
	);
	expect(hello).toBe(0);
});

test("return value", () => {
	expect(
		withWith(
			{ value: () => 2 + 2 },
			({ value }) => {
				return value();
			},
			{ lifter: (data) => eval(data.eval) }
		)
	).toBe(4);
});

test("binding", () => {
	expect(
		withWith(
			{},
			function () {
				return this;
			},
			{ binding: { exists: "yes" } }
		)
	).toEqual({ exists: "yes" });
});

test("array", () => {
	expect(
		withWith(
			[1, 2, 3],
			() => {
				return toString();
			},
			{ binding: { exists: "yes" } }
		)
	).toBe("1,2,3");
});
