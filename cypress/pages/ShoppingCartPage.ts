import { TITLE_NAMES } from '../support/constants';
import { Modal } from './Modal';

class ShoppingCartPage extends Modal {
  private ShoppingCartSelectors = {
    totalPrice: '[data-cy="total-due-value"]',
  } as const;

  shouldBeVisible() {
    this.getTitle(TITLE_NAMES.shoppingCart).should('be.visible');
    return this;
  }

  getTotalPrice() {
    return cy.get(this.ShoppingCartSelectors.totalPrice);
  }
}

export default new ShoppingCartPage();
