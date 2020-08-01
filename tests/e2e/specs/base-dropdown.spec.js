// https://docs.cypress.io/api/introduction/api.html
import { CSSTestSelector } from '../../utils';
import countries from '../../../src/data/countries.json';

describe('BaseDropdown component', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Should be able to select a value', () => {
    cy.get(CSSTestSelector.Input)
      .focus();

    cy.get(CSSTestSelector.Option)
      .first()
      .click();

    cy.get(CSSTestSelector.Input)
      .should('have.value', countries[0].label);

    cy.get(CSSTestSelector.OptionsList)
      .should('not.be.visible');
  });

  it('Should be able to select a value within autocomplete', () => {
    const inputValue = 'rain';
    const matchedOptions = countries.filter((country) => country.label.indexOf(inputValue) !== -1);

    cy.get(CSSTestSelector.Input)
      .focus()
      .type(inputValue);

    cy.contains('Typing...');
    cy.contains('Loading...');
    cy.contains('Loading...')
      .should('not.be.visible');

    cy.get(CSSTestSelector.Option)
      .should('have.length', matchedOptions.length)
      .each(($el) => {
        expect($el).to.contain(inputValue);
      })
      .first()
      .click();

    cy.get(CSSTestSelector.Input)
      .should('have.value', matchedOptions[0].label);
  });

  it('Should be able to edit selected option', () => {
    const firstOptionValue = countries[0].label;

    cy.get(CSSTestSelector.Input)
      .focus();

    cy.get(CSSTestSelector.Option)
      .first()
      .click();

    cy.get(CSSTestSelector.Input)
      .should('have.value', firstOptionValue)
      .focus()
      .type('sss')
      .should('have.value', `${firstOptionValue}sss`);
  });

  it('Should not be able to select a not existing value', () => {
    cy.get(CSSTestSelector.Input)
      .focus();

    cy.get(CSSTestSelector.Option)
      .first()
      .click();

    cy.get(CSSTestSelector.Input)
      .focus()
      .clear()
      .type('fake-option');

    cy.contains('No options found');
  });
});
