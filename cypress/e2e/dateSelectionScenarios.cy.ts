import DateAndTimeSelectionPage from '../pages/DateAndTimeSelectionPage';
import TicketsPage from '../pages/TicketsPage';
import HomePage from '../pages/HomePage';

const viewports = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'mobile', width: 390, height: 844 },
];

viewports.forEach(({ name, width, height }) => {
  describe(`Date and Time Selection Scenarios - ${name}`, () => {
    beforeEach(() => {
      cy.viewport(width, height);
      const adultCounter = 'Adult';
      cy.intercept('GET', '**/checkout/config').as('config');
      cy.intercept('GET', '**/products/**').as('products');
      cy.visit('/');
      cy.wait(['@config', '@products']);
      HomePage.openPackageProduct();
      TicketsPage.selectTickets(adultCounter, 1);
      TicketsPage.getContinueButton().should('be.enabled').click();
      DateAndTimeSelectionPage.shouldBeVisible();
      DateAndTimeSelectionPage.getProductContainer(0).should('exist');
    });

    /* 3. Date Selection - Initial Product:
      Proceed to the next step in the booking flow.
      Observation: Initially, only the first product within the package should be available for date selection.
      Action: For this first product, select today's date.
      Expected Outcome: Upon confirming today's date for the first product, all remaining products within the package should become accessible.
      note: This functionality ensures customers don't need to select the same date for every product, as they are intended to be visited on the same day.
    */
    it('task 3: should select the date and time for the first product', () => {
      DateAndTimeSelectionPage.getDateSelectionButton(0).should('be.enabled');

      for (let i = 1; i < 4; i++) {
        DateAndTimeSelectionPage.getDateSelectionButton(i).should('be.disabled');
      }

      DateAndTimeSelectionPage.selectTodayDateAndSave(0);
      DateAndTimeSelectionPage.getSelectedDateText(0).then((date) => {
        cy.log('Selected date is: ' + date);
        const expectedTileCount = 4;
        for (let i = 1; i < expectedTileCount; i++) {
          DateAndTimeSelectionPage.openDateTimeModal(i);
          cy.get('[data-cy="fixed-day"]').should('exist').invoke('text').should('eq', date.trim());
          DateAndTimeSelectionPage.closeDateTimeModal(i);
        }
      });
    });

    /* 4. Date & Time Selection - Subsequent Product (Two Scenarios):
      Proceed to the next required product in the flow.
      Prepare both scenarios in one test:
      Scenario A (Happy Path): Timeslots are available until 15:00
      Action: The application allows confirming today's date. Randomly select an available timeslot and confirm the selection.
      Scenario B (Edge Case - Closed Slots): Timeslots are available after 15:00
      Action: The application does not allow confirming today's date because all timeslots or the entire day are assigned in the response with the status: "closed".
      Action: Close the product's date/time selection modal/section.
      */
    it('task 4: should select timeslot for the second product', () => {
      const now = new Date();
      const currentHour = now.getHours();

      DateAndTimeSelectionPage.selectTodayDateAndSave(0);
      DateAndTimeSelectionPage.openDateTimeModal(1);

      if (currentHour >= 0 && currentHour < 15) {
        cy.get('[data-cy="timeslot"]').should('have.length.at.least', 1);
        cy.get('[data-cy="timeslot"]').eq(0).click();
        DateAndTimeSelectionPage.saveDateSelectionButton(1);
        DateAndTimeSelectionPage.getSelectedDateElement(1).should('not.be.empty');
      } else if (currentHour >= 15) {
        cy.get('[data-cy="timeslot"]').should('not.exist');
        DateAndTimeSelectionPage.closeDateTimeModal(1);
      }
    });

    /* 5. Reset selection:
      Action: Despite the previous selection, the customer decides the chosen times are unsuitable. Use the "Reset selection" option.
      Expected Outcome: The selection for all products should be reset.
    */
    it('task 5: should erase date with the reset selection button', () => {
      const expectedTileCount = 4;

      DateAndTimeSelectionPage.selectTodayDateAndSave(0);
      DateAndTimeSelectionPage.getSelectedDateElement(0)
        .invoke('text')
        .then((date) => {
          cy.log('Selected date is: ' + date);
          for (let i = 1; i < expectedTileCount; i++) {
            DateAndTimeSelectionPage.openDateTimeModal(i);
            cy.get('[data-cy="fixed-day"]')
              .should('exist')
              .invoke('text')
              .should('eq', date.trim());
            DateAndTimeSelectionPage.closeDateTimeModal(i);
          }
        });
      DateAndTimeSelectionPage.resetAllDateSelections();
      cy.get('[data-cy="button-spinner"]').should('not.exist');
      for (let i = 0; i < expectedTileCount; i++) {
        DateAndTimeSelectionPage.getSelectedDateElement(i).should('not.exist');
      }
    });
  });
});
