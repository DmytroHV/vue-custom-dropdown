const DATA_ATTRIBUTE = 'data-test';

const generateSelector = (element) => `[${DATA_ATTRIBUTE}="${element}"]`;

export const CSSDataTestElement = {
  Input: 'base-dropdown-input',
  Option: 'base-dropdown-option',
  Label: 'base-dropdown-label',
  Container: 'base-dropdown-container',
  OptionsList: 'base-dropdown-options',
};

export const CSSTestSelector = Object.keys(CSSDataTestElement).reduce(
  (accumulator, key) => ({ ...accumulator, [key]: generateSelector(CSSDataTestElement[key]) }), {},
);
