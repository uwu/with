export function getFunctionArguments(functionString: string): string[] {
	const args = functionString
		.match(/(?:\((.*?)\))|(?:(.*?)\s*=>)/s)
		?.filter((g, i) => g && i)[0];
	return args ? args.split(",").map((arg) => arg.trim()) : [];
}

export function getRenameMap(
	functionString: string
): Map<string | symbol, string> {
	// Minifiers can rename the unused args. Yay!
	const typeArgs = functionString
		.match(/\({(?<args>.*?)}\)/s)
		?.groups?.args.replace(/\s/gs, "");

	let renameMap = {};
	if (typeArgs != null) {
		renameMap = typeArgs.split(",").reduce((acc, variable) => {
			const oldName = variable.split(":")[0];
			const newName = variable.split(":")[1] ?? variable.split(":")[0];
			acc[newName] = oldName;
			return acc;
		}, {} as Record<string, string>);
	}
	return new Map(Object.entries(renameMap));
}

export function getFunctionBody(functionString: string): string | null {
	// We can safely assume the the user is only destructuring.
	const body = functionString.replace(/\((?<args>.*?)\)/s, "").trim();

	// () => {...}
	// function () {...}
	if (/^=>\s*?{/s.test(body) || body.startsWith("function")) {
		return body.replace(/^(?:=>|function)\s*?{(.+)}$/s, "$1");
	}
	// () => (...)
	// () => ...
	else if (body.startsWith("=>")) {
		return `return (${body.slice(2)})`;
	}

	return null;
}

export type EvalData = {
	eval: string;
	variable: string;
	value?: unknown;
};

export type WithWithOptions<T> = {
	lifter?: (evalData: EvalData) => unknown;
	binding?: T;
};

export default function withWith<Scope extends object, Return, Binding>(
	scope: Scope,
	callback: (this: Binding, scope: Scope) => Return,
	options?: WithWithOptions<Binding>
): Return {
	const lifterFirstArg = options?.lifter
		? getFunctionArguments(options.lifter.toString())[0]
		: "data";

	const cbString = callback.toString();

	const renameMap = getRenameMap(cbString);
	const functionBody = getFunctionBody(cbString);

	let f = new Function(`with(arguments[0]){${functionBody}}`);
	if (Object.hasOwn(options ?? {}, "binding")) {
		f = f.bind(options?.binding);
	}

	return f(
		new Proxy(scope, {
			has(target, property) {
				// Make all the scope's keys available in the new scope as variables.
				if (Reflect.has(target, property)) return true;
				if (renameMap.has(property)) return true;

				// Make all the parent scope's variables available in the new scope.
				// This only works is a lifter is passed and is working properly.
				if (options?.lifter && typeof property === "string") {
					if (
						options.lifter({
							eval: property,
							variable: property,
						}) !== undefined
					)
						return true;
				}
				return false;
			},
			get(target, property, receiver) {
				// Try getting it from the rename map first.
				if (typeof property === "string" && renameMap.has(property)) {
					property = renameMap.get(property)!;
				}

				// Grab the variable from the passed scope.
				if (Reflect.has(target, property)) {
					return Reflect.get(target, property, receiver);
				}

				// If it's not in the scope that was passed, get it from the parent scope.
				if (options?.lifter && typeof property === "string") {
					return options.lifter({
						eval: property,
						variable: property,
					});
				}
			},
			set(target, property, value, receiver) {
				// Try getting it from the rename map first.
				if (typeof property === "string" && renameMap.has(property)) {
					property = renameMap.get(property)!;
				}

				// Grab the variable from the passed scope.
				if (Reflect.has(target, property)) {
					return Reflect.set(target, property, value, receiver);
				}

				// If it's not in the scope that was passed, get it from the parent scope.
				if (
					options?.lifter &&
					typeof property === "string" &&
					!Reflect.has(target, property)
				) {
					// Send the value directly back to the parent scope.
					options.lifter({
						eval: `${property}=${lifterFirstArg}.value`,
						variable: property,
						value,
					});
				}

				return false;
			},
		})
	);
}
