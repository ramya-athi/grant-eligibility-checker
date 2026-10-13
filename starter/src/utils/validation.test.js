import { describe, it, expect } from 'vitest';
import { validateQuestion } from './validation';

describe('validateQuestion', () => {
  it('asks the user to choose when nothing is selected', () => {
    expect(validateQuestion('propertyType', '')).toEqual([
      { fieldId: 'propertyType', message: 'Select the type of property you live in' },
    ]);
  });

  it('rejects a value that is not one of the options', () => {
    expect(validateQuestion('incomeBand', 'lots')).toHaveLength(1);
  });

  it('accepts a valid option', () => {
    expect(validateQuestion('insulation', 'no')).toEqual([]);
  });

  it('requires the text box when "Other" heating is chosen', () => {
    expect(validateQuestion('heating', 'other', '   ')).toEqual([
      { fieldId: 'heatingOther', message: 'Enter how your home is heated' },
    ]);
  });

  it('limits the "Other" text to 100 characters', () => {
    expect(validateQuestion('heating', 'other', 'a'.repeat(100))).toEqual([]);
    expect(validateQuestion('heating', 'other', 'a'.repeat(101))).toEqual([
      { fieldId: 'heatingOther', message: 'How your home is heated must be 100 characters or less' },
    ]);
  });

  it('ignores the text box when a different heating option is chosen', () => {
    expect(validateQuestion('heating', 'gas', '')).toEqual([]);
  });
});
