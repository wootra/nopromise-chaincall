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
