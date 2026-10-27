import { findBagSize, findFrequency } from './plans.js';

const POSTCODE_PATTERN = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
const ROAST_CHOICES = ['light', 'medium', 'dark', 'surprise'];

export function normalizePostcode(raw) {
  const compact = raw.replace(/\s+/g, '').toUpperCase();
  if (compact.length < 5) return compact;
  return `${compact.slice(0, -3)} ${compact.slice(-3)}`;
}

export function validatePostcode(raw) {
  const value = raw.trim();
  if (value === '') return 'Enter a postcode';
  if (!POSTCODE_PATTERN.test(value)) return 'Enter a valid UK postcode';
  return null;
}

export function validateSubscription(values) {
  const errors = {};
  const postcodeError = validatePostcode(values.postcode ?? '');
  if (postcodeError) errors.postcode = postcodeError;
  if (!findBagSize(values.bagGrams)) errors.bagGrams = 'Choose a bag size';
  if (!findFrequency(values.frequency)) errors.frequency = 'Choose how often to receive coffee';
  if (!ROAST_CHOICES.includes(values.roast)) errors.roast = 'Choose a roast';
  if (!values.deliveryDay) errors.deliveryDay = 'Choose a delivery day';
  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
