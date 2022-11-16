# with with
A simple way to use the JavaScript `with` keyword in strict mode!

# installation
`(p)npm install with-with`

# usage
```js
import withWith from "with-with"

let inaccessible = true;
withWith({ hello: "there" }, () => { // you can get types via destructuring, e.g ({ hello, ...etc }) =>
  console.log(hello); // logs "there"
  console.log(inaccessible); // this will error because inaccessible does not exist within the scope
});
```