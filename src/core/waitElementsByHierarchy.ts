import TagWithAttributes from '../types/TagWithAttributes';
import findElementsByHierarchy from './findElementsByHierarchy';

type WaitMode = 'appear' | 'disappear';

interface WaitConfig {
  /** Tempo limite em milissegundos */
  limitTime: number;
  /** Elemento de onde começar a busca */
  from: HTMLElement | Element;
  /** Modo de espera: 'appear' para esperar elementos aparecerem, 'disappear' para esperar desaparecerem */
  waitMode?: WaitMode;
}

/**
 * Espera elementos aparecerem ou desaparecerem baseado na hierarquia especificada
 * @param {TagWithAttributes[]} hierarchy - Hierarquia de elementos a buscar
 * @param {WaitConfig} config - Configuração de espera
 * @returns {Promise<HTMLElement[]>} Promessa que resolve com array de elementos (vazio se waitMode='disappear')
 */
const waitElementsByHierarchy = (
  hierarchy: TagWithAttributes[],
  config: WaitConfig = {
    limitTime: 10000,
    from: document.body,
    waitMode: 'appear',
  },
): Promise<HTMLElement[]> =>
  new Promise((resolve, reject) => {
    const waitMode = config.waitMode || 'appear';

    // Validação inicial para modo disappear
    if (waitMode === 'disappear') {
      const initialElements = findElementsByHierarchy(hierarchy, config.from);
      if (initialElements.length === 0) {
        reject(
          new Error(
            `Cannot wait for elements to disappear - no elements found with the specified hierarchy: ${JSON.stringify(hierarchy)}`,
          ),
        );
        return;
      }
      console.log(`Found ${initialElements.length} element(s) to wait for disappearance`);
    }

    const timeout = setTimeout(() => {
      clearInterval(interval);
      const action = waitMode === 'appear' ? 'find' : 'wait for disappearance of';
      console.log(`timeout to ${action} elements by hierarchy: ${JSON.stringify(hierarchy)}`);
      reject(new Error(`Timeout waiting for elements to ${waitMode}`));
    }, config.limitTime);

    const interval = setInterval(() => {
      console.log(`retry waitElementsByHierarchy (${waitMode} mode): ${JSON.stringify(hierarchy)}`);
      const elements = findElementsByHierarchy(hierarchy, config.from);

      if (waitMode === 'appear') {
        // Modo aparecer: resolve quando encontra elementos
        if (elements.length > 0) {
          clearTimeout(timeout);
          clearInterval(interval);
          resolve(elements);
        }
      } else if (waitMode === 'disappear') {
        // Modo desaparecer: resolve quando NÃO encontra elementos
        if (elements.length === 0) {
          clearTimeout(timeout);
          clearInterval(interval);
          resolve([]); // Retorna array vazio quando elementos desaparecem
        }
      }
    }, 10);
  });

export default waitElementsByHierarchy;
export type { WaitConfig, WaitMode };
