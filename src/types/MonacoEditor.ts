/**
 * @fileoverview Tipos para o Monaco Editor
 * @module types/MonacoEditor
 */

/** Interface para o modelo do Monaco Editor */
interface MonacoModel {
  getFullModelRange(): unknown;
  getLineCount(): number;
  getLineLength(lineNumber: number): number;
  getValue(): string;
  setValue(value: string): void;
}

/** Interface para a posição no editor */
interface MonacoPosition {
  lineNumber: number;
  column: number;
}

/** Interface para operação de edição */
interface MonacoEdit {
  range: unknown;
  text: string;
  forceMoveMarkers?: boolean;
}

/** Interface para o Monaco Editor */
interface MonacoEditorInstance {
  getModel(): MonacoModel | null;
  setValue(value: string): void;
  executeEdits(source: string, edits: MonacoEdit[]): void;
  setPosition(position: MonacoPosition): void;
  focus(): void;
}

/** Interface extendida para HTMLElement com possíveis propriedades do Monaco */
interface HTMLElementWithMonaco extends HTMLElement {
  [key: string]: unknown;
  _editor?: MonacoEditorInstance;
  editor?: MonacoEditorInstance;
  _codeEditor?: MonacoEditorInstance;
  codeEditor?: MonacoEditorInstance;
}

export type {
  HTMLElementWithMonaco,
  MonacoEdit,
  MonacoEditorInstance,
  MonacoModel,
  MonacoPosition,
};
