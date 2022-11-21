export function getRenameMap(functionString: string): Record<string, string> {
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
	return renameMap;
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

export type WithWithOptions = {
	lifter?: (variable: string) => unknown;
	binding?: object;
};

export default function withWith<T extends object, Return>(
	scope: T,
	cb: (scope: T) => Return,
	options?: WithWithOptions
): Return {
	const cbString = cb.toString();

	const renameMap = getRenameMap(cbString);
	const functionBody = getFunctionBody(cbString);

	return new Function(`with(arguments[0]){${functionBody}}`).bind(
		options?.binding ?? globalThis
	)(
		new Proxy(scope, {
			has(target, property) {
				// Make all the scope's keys available in the new scope as variables.
				if (Reflect.has(target, property)) return true;
				if (Reflect.has(renameMap, property)) return true;

				// Make all the parent scope's variables available in the new scope.
				// This only works is a lifter is passed and is working properly.
				if ("lifter" in (options ?? {}) && typeof property === "string") {
					try {
						if (options?.lifter?.(property) !== undefined) return true;
					} catch {}
				}
				return false;
			},
			get(target, property, receiver) {
				// Try getting it from the rename map first.
				if (typeof property === "string" && property in renameMap) {
					property = renameMap[property] as string;
				}

				// Grab the variable from the passed scope.
				if (Reflect.has(target, property)) {
					return Reflect.get(target, property, receiver);
				}

				// If it's not in the scope that was passed, get it from the parent scope.
				if ("lifter" in (options ?? {}) && typeof property === "string") {
					try {
						return options?.lifter?.(property);
					} catch {}
				}
			},
			set(target, property, value, receiver) {
				// Try getting it from the rename map first.
				if (typeof property === "string" && property in renameMap) {
					property = renameMap[property] as string;
				}

				// Grab the variable from the passed scope.
				if (Reflect.has(target, property)) {
					return Reflect.set(target, property, value, receiver);
				}

				// If it's not in the scope that was passed, get it from the parent scope.
				if (
					"lifter" in (options ?? {}) &&
					typeof property === "string" &&
					!Reflect.has(target, property)
				) {
					// Stringify value. This has caveats, but it's the best way I know of.
					// Discourage setting objects directly since they can lose information.
					// Encourage setting properties on objects instead.
					try {
						options?.lifter?.(`${property}=${JSON.stringify(value)}`);
					} catch {}
				}

				return false;
			},
		})
	);
}
