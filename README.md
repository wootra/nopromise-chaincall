ChainCallJs 2.0

# Overview

v1.0 was extremly simply js module that helped longer logic to readable. 
While js community grows and impreved a lot with typescript, the coding process also has been changed.

This project is targeting fast auto-completion and shorter code for the multiple processes to reduce complexity.

## Install

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
export const chain = <T>(ret: T) => {
	return {
		then: <U>(fn: (_ret: T) => U) => {
			return chain<U>(fn(ret));
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
const getAgeGroup = (age: number) => { ... };
const getJobType = (job: string) => { ... };
const nameCard = (name: string, jobType: string) => { ... };
const printNamecard = (nameCard: string) => { ... };
const increaseWorkDone = (ageGroup: string) => { ... };

const isWorkIncreased = chain(['songhyeon', 'jun', 44, 'senior engineer'])
    .then(([first, last, age, job]) => ({
        name: `${first} ${last}`,
        ageGroup: getAgeGroup(age),
        jobType: getJobType(job),
    }))
    .then(({ name, ageGroup, jobType }) => {
        // if the values should be skipped the chain flow and should be used in the middle, make another chain flow.
        return chain(nameCard(name, jobType))
            .then(ret => printNamecard(ret))
            .then(isNameCardPrinted => {
                if (isNameCardPrinted) {
                    increaseWorkDone(ageGroup);
                }
                return false;
            })
            .value();
    })
    .value();
expect(isWorkIncreased).toBe(false);
```
</details>

when you see the code, you can see the whole complex flow in one glance.

if above logic is written without chaincalljs, this would look like this:


<details>
<summary>Click to expand!</summary>

```typescript
const getAgeGroup = (age: number) => { ... };
const getJobType = (job: string) => { ... };
const nameCard = (name: string, jobType: string) => { ... };
const printNamecard = (nameCard: string) => { ... };
const increaseWorkDone = (ageGroup: string) => { ... };

const [first, last, age, job] = ['songhyeon', 'jun', 44, 'senior engineer'];
const name = `${first} ${last}`;
const ageGroup = getAgeGroup(age);
const jobType = getJobType(job);
const namecard = nameCard(name, jobType);
const isNameCardPrinted = printCard(nameCard);
const isWorkIncreased = isNameCardPrinted ? increaseWorkDone(ageGroup) : false;

expect(isWorkIncreased).toBe(false);
```
</details>

As you see, there are bunch of variables are created to help readability, but still it is very hard to find out the relationship of the each logic.

with chaincalljs, you can organize the relationship easier to read by nature.


## Support

For support, questions, or to report issues related to the ChainCallJs, please use the GitHub [Issues page](https://github.com/wootra/nopromise-chaincall/issues) of the Turborepo project.

## License

The SVG Table Component is MIT License.
