// https://docs.cypress.io/api/introduction/api.html

describe('BaseDropdown component', () => {
  it('Should be able to select a value', () => {
    cy.visit('/');

    cy.get('[data-test="base-dropdown-input"]')
      .focus();

    cy.get('[data-test="base-dropdown-option"]:first')
      .click();

    cy.get('[data-test="base-dropdown-input"]')
      .should('have.value', 'Afghanistan');

    cy.get('[data-test="base-dropdown-options"]')
      .should('not.be.visible');
  });

  it('Should be able to select a value within autocomplete', () => {
    const inputValue = 'rain';

    cy.visit('/');

    cy.get('[data-test="base-dropdown-input"]')
      .focus()
      .type(inputValue);

    cy.contains('Typing...');
    cy.contains('Loading...');
    cy.contains('Loading...')
      .should('not.be.visible');

    cy.get('[data-test="base-dropdown-option"]')
      .should('have.length', 2)
      .each(($el) => {
        expect($el).to.contain(inputValue);
      });

    cy.get('[data-test="base-dropdown-option"]:first')
      .click();

    cy.get('[data-test="base-dropdown-input"]')
      .should('have.value', 'Bahrain');
  });

  it('Should be able to edit selected option', () => {
    cy.visit('/');

    cy.get('[data-test="base-dropdown-input"]')
      .focus();

    cy.get('[data-test="base-dropdown-option"]:first')
      .click();

    cy.get('[data-test="base-dropdown-input"]')
      .should('have.value', 'Afghanistan')
      .focus()
      .type('sss')
      .should('have.value', 'Afghanistansss');
  });

  it('Should not be able to select a not existing value', () => {
    cy.visit('/');

    cy.get('[data-test="base-dropdown-input"]')
      .focus();

    cy.get('[data-test="base-dropdown-option"]:first')
      .click();

    cy.get('[data-test="base-dropdown-input"]')
      .focus()
      .clear()
      .type('fake-option');

    cy.contains('No options found');
  });
});
