import findElementByHierarchy, { TagWithAttributes } from './findElementByHierarchy';

type TypeConfig = {
	limitTime: number;
	from: HTMLElement | Element;
};

const waitElementByHierarchy = (
	hierarchy: TagWithAttributes[],
	config: TypeConfig = {
		limitTime: 10000,
		from: document.body,
	},
): Promise<HTMLElement | null> =>
	new Promise((resolve, reject) => {
		const timeout = setTimeout(() => {
			clearInterval(interval);
			console.log(`timeout to find element by hierarchy: ${JSON.stringify(hierarchy)}`);
			reject(null);
		}, config.limitTime);

		const interval = setInterval(() => {
			console.log(`retry waitElementByHierarchy: ${JSON.stringify(hierarchy)}`);
			const element = findElementByHierarchy(hierarchy, config.from);

			if (element) {
				clearTimeout(timeout);
				clearInterval(interval);
				resolve(element);
			}
		}, 10);
	});

export default waitElementByHierarchy;
