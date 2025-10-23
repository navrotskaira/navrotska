import { Modal } from './Modal';

class SuccessPaymentPage extends Modal {
  private SuccessSelectors = {
    successPage: '[data-cy="success-page"]',
    paidAmount: '[data-cy="paid-amount"]',
  } as const;

  shouldBeVisible() {
    cy.get(this.SuccessSelectors.successPage).should('exist', { timeout: 50000 });
    return this;
  }

  getPaidAmount() {
    return cy.get(this.SuccessSelectors.paidAmount);
  }

  verifyPaidAmount(expectedAmount: string) {
    this.getPaidAmount().should('contain', expectedAmount);
  }
}

export default new SuccessPaymentPage();
