import { expect, test as it, describe } from 'vitest';
import { chain } from './chain';

describe('chain', () => {
	it('should return chain', () => {
		const val = chain(1)
			.then(ret => ret + 1)
			.then(ret => ret + 1)
			.value();
		expect(val).toBe(3);
	});

	it('should return as it is', () => {
		const val = chain(1).value();
		expect(val).toBe(1);
	});

	it('should change the type if one of the then return different type', () => {
		const val = chain(1).then(ret => ret.toString());
		expect(val.value()).toBe('1');
		expect(val.then(ret => ret.length).value()).toBe(1);
	});

	it('complex chain', () => {
		const testObj = new TestObj();

		const val = chain(['songhyeon', 'jun', 44, 'senior engineer'] as [
			string,
			string,
			number,
			string
		])
			.then(([first, last, age, job]) => ({
				name: `${first} ${last}`,
				ageGroup: getAgeGroup(age),
				jobType: getJobType(job),
			}))
			.then(({ name, ageGroup, jobType }) => {
				// if the values should be skipped the chain flow and should be used in the middle, make another chain flow.
				const store = {count: testObj.nameCards.length};
				return chain([name, jobType], store)
					.then(([name, jobType]) => testObj.nameCard(name, jobType))
					.then((ret, store) =>( testObj.printNamecard(ret), store.count++, ret))
					.then((ret, store) =>( testObj.printNamecard(ret), store.count++, ret))
					.then((ret, store) =>( testObj.printNamecard(ret), store.count++, ret))
					.then((ret, store) =>( testObj.printNamecard(ret), store.count++, ret))
					.then((_, store)=>testObj.nameCards.length === store.count && store.count === 4)
					.then(isNameCardPrinted =>(isNameCardPrinted && testObj.increaseWorkDone(ageGroup), ageGroup))
					.then(ageGroup=>testObj.numOfWorkDone[ageGroup])
					.then(nums=>nums>0)
					.value();
			})
			.value();
		expect(val).toBe(true);
	});

	it('when throwing error', () => {
		const func = ()=>{
			try{
				const testObj = new TestObj();
				return chain(['songhyeon', 'jun', 44, 'senior engineer'] as [
					string,
					string,
					number,
					string
				])
					.then(([first, last, age, job]) => ({
						name: `${first} ${last}`,
						ageGroup: getAgeGroup(age),
						jobType: getJobType(job),
					}))
					.then(({ name, ageGroup, jobType }) => {
						// if the values should be skipped the chain flow 
						// and should be used in the middle, make another chain flow.
						const store = {count: testObj.nameCards.length};
						return chain([name, jobType], store)
							.then(([name, jobType]) => testObj.nameCard(name, jobType))
							.then((ret, store) =>( testObj.printNamecard(ret), store.count++, ret))
							.then((ret, store) =>( testObj.printNamecard(ret), store.count++, ret))
							.then((ret, store) =>{
								// this will throw error, but type still will alive.
								if(store.count > 0) throw new Error("error"); 
								return ret;
							})
							.then((ret, store) =>( testObj.printNamecard(ret), store.count++, ret))
							.then((ret, store) =>( testObj.printNamecard(ret), store.count++, ret))
							.then((_, store)=>testObj.nameCards.length === store.count && store.count === 4)
							.then(isNameCardPrinted =>(isNameCardPrinted && testObj.increaseWorkDone(ageGroup), ageGroup))
							.then(ageGroup=>testObj.numOfWorkDone[ageGroup])
							.then(nums=>nums>0)
							.value();
					})
					.value();
			}catch(e){
				return false;
			}
		}
		expect(func()).toBe(false);
	});
});

type AgeGroups =
	| 'teenager'
	| 'twenties'
	| 'thirties'
	| 'forties'
	| 'fifties'
	| 'senior';
type JobTypes = 'engineer' | 'designer' | 'manager' | 'other';

const getAgeGroup = (age: number): AgeGroups => {
	if (age < 20) return 'teenager';
	if (age < 30) return 'twenties';
	if (age < 40) return 'thirties';
	if (age < 50) return 'forties';
	if (age < 60) return 'fifties';
	return 'senior';
};

const getJobType = (job: string): JobTypes => {
	if (job.includes('engineer')) return 'engineer';
	if (job.includes('designer')) return 'designer';
	if (job.includes('manager')) return 'manager';
	return 'other';
};
class TestObj {
	numOfWorkDone = {} as Record<AgeGroups, number>;
	nameCards = [] as string[];

	
	nameCard = (name: string, jobType: string) => {
		return `Name: ${name}, Job: ${jobType}`;
	};
	printNamecard = (nameCard: string) => {
		this.nameCards.push(nameCard);
		return this.nameCards.length;
	};
	increaseWorkDone = (ageGroup: AgeGroups) => {
		this.numOfWorkDone[ageGroup] = (this.numOfWorkDone[ageGroup] ?? 0) + 1;
	};
}
