/**
 * Aguarda um determinado tempo em milissegundos
 * @param {number} ms - Tempo em milissegundos para aguardar
 * @returns {Promise<void>} Promise que resolve após o tempo especificado
 */
export const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
