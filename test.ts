// @ts-nocheck

import withWith from "./src";

const dhjsk = {
	a: "b",
	b: (sub: string) => {
		console.log(sub);
	},
};

console.log("before", dhjsk);

withWith(dhjsk, () => ({ a, b }) => {
	a = "new";
	b("test");
});

console.log("after", dhjsk);

withWith(
	{ hello: "there" },
	() =>
		function () {
			console.log(this);
		},
	{ on: "this" }
);
