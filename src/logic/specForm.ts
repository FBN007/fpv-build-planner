import type { SpecField } from '../catalog/specs';
import type { SpecValue } from '../models/types';
import { parseNumber } from '../utils/format';

/** Editable form state: numbers are kept as text while typing. */
export type SpecFormValue = string | string[] | boolean;
export type SpecFormValues = Record<string, SpecFormValue>;

export function toFormValues(fields: SpecField[], specs: Record<string, SpecValue>): SpecFormValues {
  const values: SpecFormValues = {};
  for (const f of fields) {
    const v = specs[f.key];
    switch (f.kind) {
      case 'number':
        values[f.key] = typeof v === 'number' ? String(v) : '';
        break;
      case 'text':
      case 'select':
        values[f.key] = v === undefined || Array.isArray(v) || typeof v === 'boolean' ? '' : String(v);
        break;
      case 'multiselect':
        values[f.key] = Array.isArray(v) ? v.map(String) : [];
        break;
      case 'boolean':
        values[f.key] = v === true;
        break;
    }
  }
  return values;
}

/**
 * Turn form state back into stored specs. Keys of fields not shown here
 * (e.g. hidden for this vehicle type) are kept from `previous`.
 */
export function fromFormValues(
  fields: SpecField[],
  values: SpecFormValues,
  previous: Record<string, SpecValue> = {},
): { specs: Record<string, SpecValue>; errors: Record<string, string> } {
  const specs: Record<string, SpecValue> = { ...previous };
  const errors: Record<string, string> = {};

  for (const f of fields) {
    const raw = values[f.key];
    delete specs[f.key];
    switch (f.kind) {
      case 'number': {
        const text = typeof raw === 'string' ? raw : '';
        if (text.trim() === '') break;
        const n = parseNumber(text);
        if (n === null || n < 0) errors[f.key] = 'Enter a positive number';
        else specs[f.key] = n;
        break;
      }
      case 'text':
      case 'select':
        if (typeof raw === 'string' && raw.trim() !== '') specs[f.key] = raw.trim();
        break;
      case 'multiselect':
        if (Array.isArray(raw) && raw.length > 0) specs[f.key] = [...raw];
        break;
      case 'boolean':
        if (raw === true) specs[f.key] = true;
        break;
    }
  }
  return { specs, errors };
}
