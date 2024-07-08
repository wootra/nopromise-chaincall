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
