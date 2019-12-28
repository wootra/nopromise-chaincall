# NoPromise Chain Call helper

## Spoiler

If you want to see how to use, go to  [How to use](#how-to-use) section directly.

## how to install

```bash
npm i nopromise-chaincall
```


## Why you need this module

For example, Let's say I want to write this code:

```js
const arr = [1,2,3,4,5];
let ret = func1(arr);
ret = func2(ret);
ret = func3(ret);
console.log(ret);
```

as you see, we want to make the code shorter. How about like this:

```js
const arr = [1,2,3,4,5];
const ret = func3(
    func2(
        func1(arr)));
console.log(ret);
```

even though the order of run is func1, func2, func3, the code show up backward. I don't like it. And also, it is using multiple stacks. and it will be inefficient for the memory management.

What if we use Promise?

```js
const arr = [1,2,3,4,5];
new Promise(resolve=>resolve(arr))
.then(ret=>func1(ret))
.then(ret=>func2(ret))
.then(ret=>func3(ret))
.then(console.log);
```

Much better. If it is time-consuming jobs, it may be a good change because the callback console.log will be called when all the functions are finished. But if it is not? If they are pure syncronous functions and it will be finished quickly, and I want to do something after this function calls? 

We may need to make this function as async function and make this promise await. But still the function will be changed to async function. 

Complexity will be increased. And also, unnecessary Promise call will reduce your performance.

What if I can do like this?

```js
const arr = [1,2,3,4,5];
const ret = chainCallNp(
    arr,
    func1,
    func2,
    func3
);
console.log(ret);
```

This is purely syncronous function calls, and easy to understand as well.

This module will help you to program like above and some of more extensive functionalities.


## How to use

### UseCase 1 - Pure Syncronous Chain Calls

```js
const np = require('nopromise-chaincall');
const ret = np.chainCallNp(
    [1,2,3,4,5],
    func1,
    func2,
    func3
);
console.log('chainCallNp:', ret);
```

### UseCase 2 - async call with 1 Promise

```js
const np = require('nopromise-chaincall');
np.chainCall(
    [1,2,3,4,5],
    func1,
    func2,
    func3
).then(ret=>console.log('chainCall:', ret));
```

### UseCase 3 - when you want to call callbacks for each call

If your original code is like this:

```js
const arr = [1,2,3,4,5];
let ret = func1(arr);
callOther(ret, "first call");
ret = func2(ret);
callOther(ret, "second call");
ret = func3(ret);
console.log(ret);
```

as you see, after 1st and 2nd call, you want to call callOther function with the result. using nopromise-chaincall module, you can call like this:

```js
const np = require('nopromise-chaincall');
const arr = [1,2,3,4,5];
const ret = np.chainCallNp(
    arr,
    np.hoc(func1, "first call", callOther),
    np.hoc(func2, "second call", callOther),
    func3
);
console.log(ret);
```

the hoc function will return an object that the nopromise-chaincall module can understand, and do what you want to do.

Enjoy!