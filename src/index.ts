export default function withWith<T>(
	scope: T,
	cb: () => (scope: T) => void,
	binding?: object
) {
	let cbString = cb().toString();

	if (cbString.match(/{/gi).length > 1) {
		cbString = cbString.replace(/{.*?}/, "");
	}

	cbString = cbString.slice(
		cbString.indexOf("{") + 1,
		cbString.lastIndexOf("}")
	);

	new Function(`with(arguments[0]){${cbString}}`).bind(
		binding ?? globalThis
	)(scope);
}
