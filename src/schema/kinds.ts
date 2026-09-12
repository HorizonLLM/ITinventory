/*
 * kinds.ts — the Field / Collection contract.
 *
 * A collection is added without writing a table, form, filter, search, or
 * persistence layer. Describe a collection here (its fields, their behaviour)
 * and the shared Register view, table, form, filter, search and persistence all
 * follow from the schema. Adding a fifth register is documented in DESIGN.md
 * and is about five small edits.
 *
 * A field is either a scalar (string/number/enum) with display metadata.
 */

export type FieldType = 'string' | 'number' | 'enum';

export type Field =
  | StringField
  | NumberField
  | EnumField;

export interface BaseField {
  key: string;
  label: string;
  /** Whether this field participates in search and the filter UI. */
  searchable?: boolean;
}

export interface StringField extends BaseField {
  type: 'string';
}

export interface NumberField extends BaseField {
  type: 'number';
}

export interface EnumField extends BaseField {
  type: 'enum';
  options: string[];
}

export interface Collection {
  /** The collection key, e.g. `assets`. Also the localStorage + audit key. */
  key: string;
  /** Human label used in the sidebar and register title. */
  label: string;
  /** The fields that make up a record of this collection. */
  fields: Field[];
  /** A short description shown in the register header / overview. */
  summary: string;
}
