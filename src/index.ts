export default function withWith<
	T extends object,
	Lifter extends (variable?: string) => unknown,
	Return
>(
	scope: T,
	cb: (lifter?: Lifter) => (scope: T) => Return,
	options?: {
		lifter?: Lifter;
		binding?: object;
	}
): Return {
	let cbString = cb(options?.lifter).toString();

	if (cbString.indexOf("/*$WITHSTART$*/")) {
		cbString = cbString.slice(
			cbString.indexOf("/*$WITHSTART$*/"),
			cbString.lastIndexOf("}")
		);
	}

	return new Function(`with(arguments[0]){${cbString}}`).bind(
		options?.binding ?? globalThis
	)(
		new Proxy(scope, {
			has(target, property) {
				if (Reflect.has(target, property)) return true;
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
				if (
					typeof property === "string" &&
					!Object.hasOwn(target, property)
				) {
					return options?.lifter?.(property);
				}
				return Reflect.get(target, property, receiver);
			},
		})
	);
}
