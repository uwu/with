export default function withWith<T, Return>(
	scope: T,
	cb: () => (scope: T) => Return,
	binding?: object
): Return {
	let cbString = cb().toString();

	if (cbString.match(/{/gi).length > 1) {
		cbString = cbString.replace(/{.*?}/, "");
	}

	cbString = cbString.slice(
		cbString.indexOf("{") + 1,
		cbString.lastIndexOf("}")
	);

	return new Function(`with(arguments[0]){${cbString}}`).bind(
		binding ?? globalThis
	)(scope);
}
