export default function withGlobal<T>(scope: T, cb: (scope: T) => void) {
	new Function(`with(arguments[0]){(${cb.toString()})(arguments[0])}`)(
		scope
	);
}
