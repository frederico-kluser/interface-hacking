import findElementsByHierarchy from '../core/findElementsByHierarchy.js';
import monacoListElementSelector from '../selectors/monaco-dropdown-row.js';
import type { DropdownItem } from './triggerMonacoDropdown.js';

/**
 * Filtra apenas os elementos que estão realmente visíveis (dropdown aberto)
 * @param {HTMLElement[]} rows - Array de elementos do dropdown
 * @returns {HTMLElement[]} Array apenas com elementos visíveis
 */
export const filterVisibleDropdownRows = (rows: HTMLElement[]): HTMLElement[] => {
  return rows.filter((row) => {
    const contextView = row.closest('.context-view');
    return (
      contextView &&
      contextView instanceof HTMLElement &&
      contextView.style.display !== 'none' &&
      !contextView.hasAttribute('aria-hidden')
    );
  });
};

/**
 * Extrai informações estruturadas de um item do dropdown
 * @param {HTMLElement} row - Elemento do item do dropdown
 * @returns {DropdownItem} Informações estruturadas do item
 */
export const extractDropdownItemInfo = (row: HTMLElement): DropdownItem => {
  const title = row.querySelector('.title')?.textContent?.trim() || '';
  const description = row.querySelector('.description')?.textContent?.trim() || '';
  const ariaLabel = row.getAttribute('aria-label') || '';
  const isSelected = row.getAttribute('aria-checked') === 'true';
  const dataIndex = parseInt(row.getAttribute('data-index') || '0', 10);
  const role = row.getAttribute('role') || '';

  return {
    element: row,
    title,
    description,
    ariaLabel,
    isSelected,
    dataIndex,
    role,
  };
};

/**
 * Encontra e filtra todos os itens visíveis do dropdown
 * @returns {HTMLElement[]} Array com elementos visíveis do dropdown
 */
export const findVisibleDropdownItems = (): HTMLElement[] => {
  const dropdownListRows = findElementsByHierarchy({ hierarchy: monacoListElementSelector, from: document.body });
  return filterVisibleDropdownRows(dropdownListRows);
};

/**
 * Lista detalhadamente todos os itens visíveis do dropdown
 * @returns {DropdownItem[]} Array com informações estruturadas dos itens
 */
export const listDropdownItems = (): DropdownItem[] => {
  // eslint-disable-next-line no-console
  console.log('🎯 Monaco dropdown list-row detectado! Listando itens do dropdown:');

  const dropdownListRows = findElementsByHierarchy({ hierarchy: monacoListElementSelector, from: document.body });
  const visibleRows = filterVisibleDropdownRows(dropdownListRows);

  // eslint-disable-next-line no-console
  console.log(`🔍 Total de rows encontrados: ${dropdownListRows.length}`);
  // eslint-disable-next-line no-console
  console.log(`👁️ Rows visíveis (dropdown aberto): ${visibleRows.length}`);

  const items: DropdownItem[] = [];

  visibleRows.forEach((row, index) => {
    const item = extractDropdownItemInfo(row);
    items.push(item);

    // eslint-disable-next-line no-console
    console.log(`  📋 Item ${index + 1} (data-index: ${item.dataIndex}):`);
    // eslint-disable-next-line no-console
    console.log(`    Título: "${item.title}"`);
    // eslint-disable-next-line no-console
    console.log(`    Descrição: "${item.description}"`);
    // eslint-disable-next-line no-console
    console.log(`    Aria-label: "${item.ariaLabel}"`);
    // eslint-disable-next-line no-console
    console.log(`    Role: "${item.role}"`);
    // eslint-disable-next-line no-console
    console.log(`    Selecionado: ${item.isSelected ? '✅' : '❌'}`);
    // eslint-disable-next-line no-console
    console.log(`    Classes: "${row.className}"`);
    // eslint-disable-next-line no-console
    console.log(`    Elemento:`, row);
  });

  // eslint-disable-next-line no-console
  console.log(`🎯 Total de itens do dropdown Copilot: ${visibleRows.length}`);

  return items;
};
