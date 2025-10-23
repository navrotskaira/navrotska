import { TITLE_NAMES } from '../support/constants';
import { Modal } from './Modal';

class DateAndTimeSelectionPage extends Modal {
  private productSelectors = {
    productContainer: (count: number) => `[data-cy="include-product-${count}"]`,
  } as const;

  private DateTimeSelectors = {
    counter: (type: string) => `[data-cy="ticket-counter-${type}"]`,
    increaseButton: '[data-cy="increase-button"]',
    selectDateAndTimeButton: '[data-cy="select-date-and-time-button"]',
    activeDate: '[data-cy="calendar-day-active"]',
    saveDateSelectionButton: 'button:has([data-cy="slot-wrapper"]:contains("Save"))',
    resetSelectionButton: 'button:has([data-cy="slot-wrapper"]:contains("Reset selection"))',
    selectedDate: (productCount: number) => `[data-cy="selected-travel-date-${productCount}"]`,
    closeButton: '[data-cy="close-selection"]',
    timeslot: '[data-cy="timeslot"]',
    fixedDay: '[data-cy="fixed-day"]',
  } as const;

  shouldBeVisible() {
    this.getTitle(TITLE_NAMES.dateAndTime).scrollIntoView().should('be.visible');
    return this;
  }

  getProductContainer(productCount: number) {
    return cy.get(this.productSelectors.productContainer(productCount));
  }

  getDateSelectionButton(productCount: number) {
    return this.getProductContainer(productCount).find(
      this.DateTimeSelectors.selectDateAndTimeButton
    );
  }

  getSelectedDateElement(productCount: number) {
    return cy.get(this.DateTimeSelectors.selectedDate(productCount));
  }

  getSelectedDateText(productCount: number) {
    return this.getSelectedDateElement(productCount).invoke('text');
  }

  openDateTimeModal(productCount: number) {
    this.getProductContainer(productCount)
      .find(this.DateTimeSelectors.selectDateAndTimeButton)
      .should('exist')
      .click();
    return this;
  }

  closeDateTimeModal(productCount: number) {
    this.getProductContainer(productCount).find(this.DateTimeSelectors.closeButton).click();
    return this;
  }

  resetAllDateSelections() {
    cy.get(this.DateTimeSelectors.resetSelectionButton).click();
    return this;
  }

  saveDateSelectionButton(productCount: number) {
    cy.get(this.DateTimeSelectors.saveDateSelectionButton).click();
    return this;
  }

  selectTodayDateAndSave(productCount: number) {
    this.openDateTimeModal(productCount);
    cy.get(this.DateTimeSelectors.activeDate).should('exist').click();
    cy.get(this.DateTimeSelectors.saveDateSelectionButton)
      .click()
      .then(() => {
        cy.get(this.DateTimeSelectors.selectedDate(productCount))
          .should('exist')
          .and('not.be.empty');
      });
  }

  selectDateNextMonthAndSave(productCount: number) {
    cy.intercept('GET', '**/availability/calendar**').as('calendarAvailability');

    this.openDateTimeModal(productCount);
    cy.get('[data-cy="calendar"]').should('exist').and('be.visible');
    cy.wait('@calendarAvailability');
    cy.get('[data-cy="month-navigation-right"]').click();
    cy.wait('@calendarAvailability');
    cy.get('[data-cy="day-number"]').eq(0).click();
    cy.get(this.DateTimeSelectors.saveDateSelectionButton)
      .click()
      .then(() => {
        cy.get(this.DateTimeSelectors.selectedDate(productCount))
          .should('exist')
          .and('not.be.empty');
      });
  }
}

export default new DateAndTimeSelectionPage();
