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
		const getAgeGroup = (age: number) => {
			if (age < 20) return 'teenager';
			if (age < 30) return 'twenties';
			if (age < 40) return 'thirties';
			if (age < 50) return 'forties';
			if (age < 60) return 'fifties';
			return 'senior';
		};

		const getJobType = (job: string) => {
			if (job.includes('engineer')) return 'engineer';
			if (job.includes('designer')) return 'designer';
			if (job.includes('manager')) return 'manager';
			return 'other';
		};
		const nameCard = (name: string, jobType: string) => {
			return `Name: ${name}, Job: ${jobType}`;
		};
		const printNamecard = (nameCard: string) => {
			console.log(nameCard);
			return true;
		};
		const increaseWorkDone = (ageGroup: string) => {
			console.log(`${ageGroup} work done increased`);
		};

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
				return chain([name, jobType])
					.then(([name, jobType]) => nameCard(name, jobType))
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
		expect(val).toBe(false);
	});
});
