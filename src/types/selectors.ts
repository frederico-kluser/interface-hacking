/**
 * @fileoverview Barrel export para tipos de seletores
 * @module types/selectors
 */

// Re-exports como named exports para compatibilidade
export type { default as ExtendedSelector } from './ExtendedSelector.js';
export type { default as SelectorMetadata } from './SelectorMetadata.js';
export type { default as SelectorSearchOptions } from './SelectorSearchOptions.js';
export type { default as SelectorValidation } from './SelectorValidation.js';

// Default exports
export { default as ExtendedSelectorDefault } from './ExtendedSelector.js';
export { default as SelectorMetadataDefault } from './SelectorMetadata.js';
export { default as SelectorSearchOptionsDefault } from './SelectorSearchOptions.js';
export { default as SelectorValidationDefault } from './SelectorValidation.js';
