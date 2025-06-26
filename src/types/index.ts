export type TagAttribute = { attribute: string; value: string; isRegex?: boolean };

export interface TagWithAttributes {
  tag: string;
  attributes: TagAttribute[];
}
