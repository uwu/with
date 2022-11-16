import withWith from "./src";

let accessible = { a: "b" };
const returnValue = withWith(
	{ hello: "there" },
	() =>
		({ hello }) => {
			console.log("hello", hello);
			console.log("accessible", accessible);
			accessible.a = "new";
			return hello;
		},
	{ lifter: (k) => eval(k) }
);
console.log(returnValue, accessible);

console.log(
	withWith(
		{ hello: "there" },
		() =>
			function () {
				return this;
			},
		{ binding: { on: "this" } }
	)
);

console.log(
	withWith({ hello: "there" }, () => () => 0, { binding: { on: "this" } })
);
