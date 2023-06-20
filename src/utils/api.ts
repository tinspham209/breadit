/* eslint-disable use-isnan */
export const isEmpty = (value: any): boolean =>
	value === undefined ||
	value === null ||
	// value === NaN ||
	(typeof value === "object" && Object.keys(value).length === 0) ||
	(typeof value === "string" && value === "") ||
	(Array.isArray(value) && value.length === 0);

export const stringify = (
	params: { [key: string]: number | string | string[] | boolean },
	excludeKey: string[] = []
) => {
	let result = "";

	if (!params) return "";

	Object.keys(params).forEach((key) => {
		if (!isEmpty(params[`${key}`]) || excludeKey.includes(`${key}`)) {
			if (Array.isArray(params[`${key}`])) {
				let array = params[`${key}`] as string[];
				array.forEach((param: string) => {
					result += `&${key}=${encodeURIComponent(param)}`;
				});
			} else {
				result += `&${key}=${encodeURIComponent(params[`${key}`].toString())}`;
			}
		}
	});

	result = result.replace(/^&/, "");

	return result;
};
