import TagWithAttributes from '../types/TagWithAttributes';
import findElementsByHierarchy from './findElementsByHierarchy';

interface WaitConfig {
  limitTime: number;
  from: HTMLElement | Element;
}

const waitElementsByHierarchy = (
  hierarchy: TagWithAttributes[],
  config: WaitConfig = {
    limitTime: 10000,
    from: document.body,
  },
): Promise<HTMLElement[]> =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      clearInterval(interval);
      console.log(`timeout to find elements by hierarchy: ${JSON.stringify(hierarchy)}`);
      reject(new Error('Timeout waiting for elements'));
    }, config.limitTime);

    const interval = setInterval(() => {
      console.log(`retry waitElementsByHierarchy: ${JSON.stringify(hierarchy)}`);
      const elements = findElementsByHierarchy(hierarchy, config.from);

      if (elements.length > 0) {
        clearTimeout(timeout);
        clearInterval(interval);
        resolve(elements);
      }
    }, 10);
  });

export default waitElementsByHierarchy;
