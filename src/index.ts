export const WITH_START_COMMENT = "/*$WITHSTART$*/";
export const WITH_START_EVAL = `eval("${WITH_START_COMMENT}")`;
// export const WITH_END_COMMENT = "/*$WITHSTART$*/";
// export const WITH_END_EVAL = `eval("${}")`;

export default function withWith<T extends object, Return>(
	scope: T,
	cb: () => (scope: T) => Return,
	options?: {
		lifter?: (variable: string) => unknown;
		binding?: object;
	}
): Return {
	let cbString = cb().toString();

	// Check for eval version first since it contains the comment.
	const wseIndex = cbString.indexOf(WITH_START_EVAL);
	let wscIndex;
	if (wseIndex !== -1) {
		let startIndex = wseIndex;
		let endChar = "";
		while (startIndex > 0) {
			if (cbString[startIndex] === "{") {
				endChar = "}";
				break;
			}
			if (cbString[startIndex] === "(") {
				endChar = ")";
				break;
			}
			startIndex--;
		}
		cbString = cbString.slice(
			wseIndex + WITH_START_EVAL.length + 1,
			cbString.lastIndexOf(endChar)
		);
		if (endChar === ")") {
			cbString = `return (${cbString})`;
		}
	} // Only try the comment version if the eval version doesn't exist.
	else if ((wscIndex = cbString.indexOf(WITH_START_COMMENT)) !== -1) {
		cbString = cbString.slice(wscIndex - 1);
	}

	return new Function(`with(arguments[0]){${cbString}}`).bind(
		options?.binding ?? globalThis
	)(
		new Proxy(scope, {
			has(target, property) {
				// Make all the scope's keys available in the new scope as variables.
				if (Reflect.has(target, property)) return true;
				// Make all the parent scope's variables available in the new scope.
				// This only works is a lifter is passed and is working properly.
				if (
					"lifter" in (options ?? {}) &&
					typeof property === "string" &&
					options?.lifter?.(property) !== undefined
				) {
					return true;
				}
				return false;
			},
			get(target, property, receiver) {
				// If it's not in the scope that was passed, get it from the parent scope.
				if (typeof property === "string" && !(property in target)) {
					return options?.lifter?.(property);
				}
				// Grab the variable from the passed scope.
				return Reflect.get(target, property, receiver);
			},
		})
	);
}
