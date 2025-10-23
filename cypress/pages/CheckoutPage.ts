import { TITLE_NAMES } from '../support/constants';
import { Modal } from './Modal';

class CheckoutPage extends Modal {
  private CheckoutSelectors = {
    totalPrice: '[data-cy="total-due-value"]',
    promoCodeButton: '[data-cy="enter-code-button"]',
    promoCodeInput: '[data-cy="code-input"]',
    promoCodeApplyButton: '[data-cy="code-check-button"]',
    promoApprovalButton: '[data-cy="button-spinner"]',
  } as const;

  private ContactSelectors = {
    firstNameInput: '[data-cy="firstName-input"]',
    lastNameInput: '[data-cy="lastName-input"]',
    countrySelectWrapper: '[data-cy="select-wrapper"]',
    countrySelectOption: '[data-cy="select-options"]',
    stateInput: '[data-cy="state-input"]',
  } as const;

  private ConsentSelectors = {
    bookingTermsCheckbox: '[data-cy="bookingTerms-checkbox"]',
    cancellationPolicyCheckbox: '[data-cy="cancellationPolicy-checkbox"]',
  } as const;

  shouldBeVisible() {
    this.getTitle(TITLE_NAMES.checkout).should('exist');
    return this;
  }

  getTotalPrice() {
    return cy.get(this.CheckoutSelectors.totalPrice);
  }

  getPromoApprovalButton() {
    return cy.get(this.CheckoutSelectors.promoApprovalButton);
  }

  fillPromoCode(promoCode: string) {
    cy.get(this.CheckoutSelectors.promoCodeButton).click();
    cy.get(this.CheckoutSelectors.promoCodeInput).type(promoCode);
    cy.get(this.CheckoutSelectors.promoCodeApplyButton).click();
  }

  selectCountry(country: string) {
    cy.get(this.ContactSelectors.countrySelectWrapper).click();
    cy.get(this.ContactSelectors.countrySelectOption).find('button').contains(country).click();
  }

  fillContactFields(firstName: string, lastName: string, country: string, state: string) {
    cy.get(this.ContactSelectors.firstNameInput).type(firstName);
    cy.get(this.ContactSelectors.lastNameInput).type(lastName);
    this.selectCountry(country);
    cy.get(this.ContactSelectors.stateInput).type(state);
  }

  fillConsentFields() {
    cy.get(this.ConsentSelectors.bookingTermsCheckbox).click();
    cy.get(this.ConsentSelectors.cancellationPolicyCheckbox).click();
  }
}

export default new CheckoutPage();
