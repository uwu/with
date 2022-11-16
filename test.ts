import withGlobakdsnjk from "./src";

withGlobakdsnjk(
	{
		a: "b",
		b: (sub: string) => {
			console.log(sub);
		},
	},
	({ a, b }) => {
		console.log(a, b("macOS"));
	}
);
