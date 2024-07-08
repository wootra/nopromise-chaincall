ChainCallJs 2.0

# Overview

ChaincallJs@2 is targeting below goals.
1. Reduce complexity of the code
1. Fast auto-completion
1. Induce modularization of the code.

While this is a very simple library, it is suggesting stream-based programming to reduce complexity in a logical process.

For example, in Java, stream syntax simplifies the logical flow. We have similar structure in Promise.
We have the new async/await model now, but Promise's .then() model helps to block the logical flows in the different boundary.

ChainCallJs@2 is trying to provide similar structure in the synchronous model.

## Install (Or just copy the code in your repo!)

```sh
npm i chaincalljs@2
```

## Motivation

Let's say we have a long logic. Most of the time, we will need to call functions and get the return values and pass some of it into the next function.
No problem. But what it will be very easy to make a complex inter-relations between multiple function calls.

```javascript

const a = funcA(param1, param2, param3);
const {b,c,d} = a;
const e = funcB(param1, param2, c, d);
const f = funcC(param2, b, e);
const {g, h} = f;
const i = funcD(g, h);
```

Yeah. I know. it is common. But it makes the code to read and analyze harder.
What if we can limit blocks?

```javascript
const a = funcA(param1, param2, param3);
let f;
{
    const {b,c,d} = a;
    const e = funcB(param1, param2, c, d);
    f = funcC(param2, b, e);
}
const {g, h} = f;
const i = funcD(g, h);
```

or we can make the block to the other function
<details>
<summary>Click to expand!</summary>

```javascript

const a = funcA(param1, param2, param3);
const doSomeWorks = (a)=>{
    const {b,c,d} = a;
    const e = funcB(param1, param2, c, d);
    return funcC(param2, b, e);
}
const f = doSomeWorks(a);
const {g, h} = f;
const i = funcD(g, h);
```

</details>

Both of the approach will be good. But what if I can do something like this?

## Usage

<details>
<summary>Click to expand!</summary>

```javascript
const i = chain(funcA(param1, param2, param3))
    .then(({b,c,d})=>
        chain(funcB(param1, param2, c, d))
            .then((e)=>funcC(param2, b, e))
    )
    .then(({g, h})=>funcD(g, h))
    .value();
```
</details>

the flow above has specific block. Of course, param1, param2 is used in the multiple levels, but temporary return values are not overflowing.

The benefit of this flow is, you can clearly see the dependencies between flows without making unnecessary function logics which will require a lot of management.

the whole chancalljs logic is very simple.

<details>
<summary>Click to expand!</summary>

```typescript
export const chain = <T, S>(ret: T, store: S = {} as S) => {
	return {
		then: <U>(fn: (_ret: T, store: S) => U) => {
			return chain<U, S>(fn(ret, store), store);
		},
		value: () => {
			return ret;
		},
	};
};

```
</details>

but it is very powerful since it support type and enforce a clean coding standard.

<details>
<summary>Click to expand!</summary>

```typescript

const isWorkGroupDone = chain(['songhyeon', 'jun', 44, 'senior engineer'])
			.then(([first, last, age, job]) => ({
				name: `${first} ${last}`,
				ageGroup: getAgeGroup(age),
				jobType: getJobType(job),
			}))
			.then(({ name, ageGroup, jobType }) => {
				// if the values should be skipped the chain flow and should be used in the middle, make another chain flow.
				const store = {count: nameCards.length};
				return chain([name, jobType], store)
					.then(([name, jobType]) => nameCard(name, jobType))
					.then((card, store) =>( printNamecard(card), store.count++, card))
					.then((card, store) =>( printNamecard(card), store.count++, card))
					.then((card, store) =>( printNamecard(card), store.count++, card))
					.then((card, store) =>( printNamecard(card), store.count++, card))
					.then((_, store)=>nameCards.length === store.count && store.count === 4)
					.then(isNameCardPrinted =>(isNameCardPrinted && increaseWorkDone(ageGroup), ageGroup))
					.then(ageGroup=>numOfWorkDone[ageGroup] > 0)
					.value();
			})
			.value();
```
</details>

when you see the code, you can see the whole complex flow in one glance.

if above logic is written without chaincalljs, this would look like this:


<details>
<summary>Click to expand!</summary>

```typescript

const [first, last, age, job] = ['songhyeon', 'jun', 44, 'senior engineer'];

const name = `${first} ${last}`;

const ageGroup = getAgeGroup(age);
const jobType = getJobType(job);
const card = nameCard(name, jobType);

const store = {count: nameCards.length};

printNamecard(card);
printNamecard(card);
printNamecard(card);
printNamecard(card);

const isNameCardPrinted = nameCards.length === store.count && store.count === 4;
isNameCardPrinted && increaseWorkDone(ageGroup);

const isWorkGroupDone = numOfWorkDone[ageGroup] > 0;
```
</details>

It could be a preference of coding, but to me, chaincalljs solution looks more organized.
On the contrary, the logic without chaincalljs tends to be a bit more scattered and hard to find the relationship between logics.


## try/catch

Unlike Promise's .then() model, chaincalljs does not support .catch() function.
It makes harder to infer return type of the function. 
I recommend you to just wrap it with try/catch to make the pattern more obvious.

<details>
<summary>Click to expand!</summary>

```typescript
const myFunc = ():D => {
    try{
        // since we don't know
        return chain(funcA(param1, param2, param3)) // return A type
            .then(funcB) // return B type 
            .then(funcC) // return C type
            .then(fundD) // return D type
            .value(); // will return D type if everything passes.

    }catch(e){
        console.error("process failed", e);
        return DEFAULT_RET as D; // return D type to keep the type consistent.
    }
}
```

</details>

## Support

For support, questions, or to report issues related to the ChainCallJs, please use the GitHub [Issues page](https://github.com/wootra/nopromise-chaincall/issues) of the Turborepo project.

## License

The SVG Table Component is MIT License.
