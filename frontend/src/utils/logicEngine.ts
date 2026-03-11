import { LogicRule, FormValue } from '../types';

/**
 * Evaluates logic rules for a given field based on current form data
 * @param rules - Array of logic rules to evaluate
 * @param formData - Current form data object
 * @returns Object with actions to apply (show, hide, require, highlight, color)
 */
export const evaluateLogicRules = (
  rules: LogicRule[] | undefined,
  formData: Record<string, FormValue>
): {
  show: boolean;
  hide: boolean;
  require: boolean;
  highlight: boolean;
  color?: string;
} => {
  if (!rules || rules.length === 0) {
    return { show: false, hide: false, require: false, highlight: false };
  }

  const result = {
    show: false,
    hide: false,
    require: false,
    highlight: false,
    color: undefined as string | undefined,
  };

  for (const rule of rules) {
    const { when, operator, value, action, color } = rule;
    const fieldValue = formData[when];

    let conditionMet = false;

    // Evaluate condition
    switch (operator) {
      case 'eq':
        conditionMet = fieldValue === value;
        break;
      case 'neq':
        conditionMet = fieldValue !== value;
        break;
      case 'gt':
        conditionMet = Number(fieldValue) > Number(value);
        break;
      case 'gte':
        conditionMet = Number(fieldValue) >= Number(value);
        break;
      case 'lt':
        conditionMet = Number(fieldValue) < Number(value);
        break;
      case 'lte':
        conditionMet = Number(fieldValue) <= Number(value);
        break;
      default:
        conditionMet = false;
    }

    // Apply action if condition met
    if (conditionMet) {
      switch (action) {
        case 'show':
          result.show = true;
          break;
        case 'hide':
          result.hide = true;
          break;
        case 'require':
          result.require = true;
          break;
        case 'highlight':
          result.highlight = true;
          if (color) result.color = color;
          break;
      }
    }
  }

  return result;
};
