/**
 * @fileoverview Configuração para o sistema de busca DOM
 * @module config/dom-finder
 */

/**
 * Interface de configuração para o DOM Finder
 * @interface DomFinderConfig
 */
export interface DomFinderConfig {
  /** Timeout padrão em milissegundos para buscas assíncronas */
  defaultTimeoutMs: number;
  /** Nível de log para depuração */
  logLevel: 'silent' | 'info' | 'debug';
  /** Habilita cache de resultados de busca */
  enableCache?: boolean;
  /** Tempo de vida do cache em ms */
  cacheLifetimeMs?: number;
  /** Habilita MutationObserver ao invés de polling */
  preferMutationObserver?: boolean;
  /** Intervalo de polling em ms quando MutationObserver não é usado */
  pollingIntervalMs?: number;
}

/**
 * Configuração padrão do DOM Finder
 * @const defaultConfig
 */
export const defaultConfig: DomFinderConfig = {
  defaultTimeoutMs: 10000,
  logLevel: 'info',
  enableCache: false,
  cacheLifetimeMs: 5000,
  preferMutationObserver: true,
  pollingIntervalMs: 50,
};

/**
 * Classe para gerenciar configuração do DOM Finder
 * @class DomFinderConfigManager
 */
export class DomFinderConfigManager {
  private static instance: DomFinderConfigManager;
  private config: DomFinderConfig;

  /**
   * Constructor privado para implementar Singleton
   */
  private constructor() {
    this.config = { ...defaultConfig };
  }

  /**
   * Obtém instância única do gerenciador
   * @returns {DomFinderConfigManager} Instância do gerenciador
   */
  static getInstance(): DomFinderConfigManager {
    if (!DomFinderConfigManager.instance) {
      DomFinderConfigManager.instance = new DomFinderConfigManager();
    }
    return DomFinderConfigManager.instance;
  }

  /**
   * Obtém configuração atual
   * @returns {DomFinderConfig} Configuração atual
   */
  getConfig(): DomFinderConfig {
    return { ...this.config };
  }

  /**
   * Atualiza configuração parcialmente
   * @param {Partial<DomFinderConfig>} updates - Valores a atualizar
   * @returns {DomFinderConfig} Nova configuração completa
   */
  updateConfig(updates: Partial<DomFinderConfig>): DomFinderConfig {
    this.config = { ...this.config, ...updates };
    return this.getConfig();
  }

  /**
   * Reseta configuração para valores padrão
   * @returns {DomFinderConfig} Configuração padrão
   */
  resetConfig(): DomFinderConfig {
    this.config = { ...defaultConfig };
    return this.getConfig();
  }

  /**
   * Verifica se deve logar baseado no nível atual
   * @param {string} level - Nível do log desejado
   * @returns {boolean} True se deve logar
   */
  shouldLog(level: 'info' | 'debug'): boolean {
    if (this.config.logLevel === 'silent') return false;
    if (this.config.logLevel === 'info' && level === 'debug') return false;
    return true;
  }
}

/**
 * Instância singleton exportada para conveniência
 */
export const domFinderConfig = DomFinderConfigManager.getInstance();
