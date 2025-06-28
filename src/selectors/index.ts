/**
 * @fileoverview Barrel export para todos os seletores
 * @module selectors
 * @description Exporta todos os seletores organizados por categoria
 */

// Monaco Editor selectors
export { default as monacoEditorsSelector } from './monaco-editors.js';
export { default as viewLineSelector } from './view-line.js';
export { default as viewLinesSelector } from './view-lines.js';

// Copilot Editor selectors
export { default as interactiveInputEditorSelector } from './interactive-input-editor.js';
export { default as interactiveInputPartSelector } from './interactive-input-part.js';
export { default as interactiveViewLineSelector } from './interactive-view-line.js';

// Form elements selectors
export { default as allTextareasSelector } from './all-textareas.js';
export { default as editableTextareaSelector } from './editable-textarea.js';

// Button selectors
export { default as monacoDefaultButtonSelector } from './monaco-default-button.js';
export { default as sendButtonAriaSelector } from './send-button-aria.js';
export { default as sendIconButtonSelector } from './send-icon-button.js';
export { default as submitButtonAriaSelector } from './submit-button-aria.js';
export { default as submitButtonSelector } from './submit-button.js';

// Template selector
export { default as templateButtons } from './template.js';

// Re-export types para conveniência
export type { TagAttribute, TagWithAttributes } from '../types/index.js';
export type {
  ExtendedSelector,
  SelectorMetadata,
  SelectorSearchOptions,
} from '../types/selectors.js';
