import { TITLE_NAMES } from '../support/constants';
import { Modal } from './Modal';
class TicketsPage extends Modal {
  private ticketSelectors = {
    counter: (type: string) => `[data-cy="ticket-counter-${type}"]`,
    increaseButton: '[data-cy="increase-button"]',
  } as const;

  shouldBeVisible() {
    this.getTitle(TITLE_NAMES.tickets).should('be.visible');
    return this;
  }

  selectTickets(type: string, count: number) {
    for (let i = 0; i < count; i++) {
      cy.get(this.ticketSelectors.counter(type)).find(this.ticketSelectors.increaseButton).click();
    }
    return this;
  }
}

export default new TicketsPage();
