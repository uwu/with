import withWith from "./src";

const accessible = true;
const returnValue = withWith(
	{ hello: "there" },
	() =>
		({ hello }) => {
			eval("/*$WITHSTART$*/"), console.log("hello", hello);
			console.log("accessible", accessible);
			return hello;
		},
	{ lifter: (k) => eval(k) }
);
console.log(returnValue);

withWith(
	{ hello: "there" },
	() =>
		function () {
			eval("/*$WITHSTART$*/");
			console.log(this);
		},
	{ binding: { on: "this" } }
);
