// @ts-nocheck

import withWith from "./src";

const dhjsk = {
	a: "b",
	b: (sub: string) => {
		return `Hello, ${sub}!`;
	},
};

console.log("before", dhjsk);

console.log(
	withWith(dhjsk, () => ({ a, b }) => {
		a = "new";
		return b("test");
	})
);

console.log("after", dhjsk);

withWith(
	{ hello: "there" },
	() =>
		function () {
			console.log(this);
		},
	{ on: "this" }
);
