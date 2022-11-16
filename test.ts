import withWith from "./src";

const accessible = true;
const returnValue = withWith(
	{ hello: "there" },
	() =>
		({ hello }) => (
			eval("/*$WITHSTART$*/"),
			console.log("hello", hello),
			console.log("accessible", accessible),
			hello
		),
	{ lifter: (k) => eval(k) }
);
console.log(returnValue);

console.log(
	withWith(
		{ hello: "there" },
		() =>
			function () {
				eval("/*$WITHSTART$*/");
				return this;
			},
		{ binding: { on: "this" } }
	)
);
