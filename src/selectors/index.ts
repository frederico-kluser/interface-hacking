/**
 * @fileoverview Barrel export para todos os seletores
 * @module selectors
 * @description Exporta todos os seletores organizados por categoria
 */

// Monaco Editor selectors
export { monacoEditorsSelector, viewLinesSelector, viewLineSelector } from './monaco-editor.js';

// Copilot Editor selectors
export {
  interactiveInputPartSelector,
  interactiveInputEditorSelector,
  interactiveViewLineSelector,
} from './copilot-editor.js';

// Form elements selectors
export { allTextareasSelector, editableTextareaSelector } from './form-elements.js';

// Button selectors
export {
  sendButtonAriaSelector,
  submitButtonAriaSelector,
  sendIconButtonSelector,
  submitButtonSelector,
  monacoDefaultButtonSelector,
} from './buttons.js';

// Template buttons (exemplo)
export { TemplateButtons } from './template.js';

// Re-export types para conveniência
export type { TagWithAttributes, TagAttribute } from '../types/index.js';
export type {
  ExtendedSelector,
  SelectorMetadata,
  SelectorSearchOptions,
} from '../types/selectors.js';
