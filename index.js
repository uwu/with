export function withGlobal(obj, cb) {
  new Function("obj", `with (obj) { (${cb.toString()})() }`)(obj)
}
