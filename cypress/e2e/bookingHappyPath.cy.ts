import DateAndTimeSelectionPage from '../pages/DateAndTimeSelectionPage';
import SuccessPaymentPage from '../pages/SuccessPaymentPage';
import ShoppingCartPage from '../pages/ShoppingCartPage';
import { calculateTotalPrice } from '../support/helpers';
import QuestionPage from '../pages/QuestionPage';
import CheckoutPage from '../pages/CheckoutPage';
import TicketsPage from '../pages/TicketsPage';
import HomePage from '../pages/HomePage';
import { faker } from '@faker-js/faker';

const viewports = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'mobile', width: 390, height: 844 },
];

viewports.forEach(({ name, width, height }) => {
  describe(
    `Complete booking flow for NYC Icons Express - 1 Day Adventure package- ${name}`,
    { testIsolation: false },
    () => {
      const maxNumberOfTickets = 20;
      const adultTickets = Cypress._.random(1, 20);
      const childTickets = maxNumberOfTickets - adultTickets;
      const adultCounter = 'Adult';
      const childCounter = 'Child';
      const expectedProductCount = 4;
      const expectedTotalPrice = calculateTotalPrice(adultTickets, childTickets);
      const isMobile = name === 'mobile';

      beforeEach(() => {
        cy.viewport(width, height);
        cy.intercept('GET', '**/checkout/config').as('config');
        cy.intercept('GET', '**/products/**').as('products');
        cy.intercept('GET', '**/availability/calendar**').as('calendarAvailability');
      });

      /* 1. Navigate to Product Page & Initial Selection:
      As a customer, navigate to the product page.
      Select the "NYC Icons Express - 1 Day Adventure" package.
      */
      it('task 1.1: should open the checkout modal', () => {
        cy.visit('/');
        cy.wait(['@config', '@products']);
        HomePage.getPackageButton().should('be.visible');
        HomePage.openPackageProduct();
        TicketsPage.shouldBeVisible();
        TicketsPage.getContinueButton().should('exist');
      });

      /* 2. Ticket Quantity & Booking Window:
      The "NYC Icons Express" package is highly popular. The maximum booking window (weeks in advance) is dynamic and can be configured by the client.
      The maximum number of tickets per single purchase is limited to 20.
      The customer is unsure of the exact number of tickets needed. Therefore, select a random number of tickets for each of the two available ticket options (e.g., Adult, Child) within the allowed limits.
      */
      it('task 2: should select random number of the tickets', () => {
        TicketsPage.shouldBeVisible();
        TicketsPage.selectTickets(adultCounter, adultTickets);
        TicketsPage.selectTickets(childCounter, childTickets);
        TicketsPage.getContinueButton().should('be.enabled').click();
        DateAndTimeSelectionPage.shouldBeVisible();
      });

      /* 1. This package contains 4 individual products.*/
      it('task 1.2: should verify the number of products', () => {
        DateAndTimeSelectionPage.shouldBeVisible();
        for (let i = 0; i < expectedProductCount; i++) {
          DateAndTimeSelectionPage.getProductContainer(i).should('exist');
        }
      });

      /* 6. Revised Date & Time Selection (Full Flow):
      This time, for the first required product, select the last available booking date/timeslot and confirm the selection.
      Repeat this process for all other mandatory products in the package.
      Once all mandatory products have a selected date and time, continue the booking flow, leaving optional products unselected.
      */
      it('task 6: should select the last available booking date/timeslot for the required product', () => {
        cy.intercept('GET', '**/availability/calendar**').as('calendarAvailability');
        DateAndTimeSelectionPage.getProductContainer(0).should('exist');
        DateAndTimeSelectionPage.selectDateNextMonthAndSave(0);

        // filling date for the second product
        DateAndTimeSelectionPage.openDateTimeModal(1);
        cy.get('[data-cy="timeslot"]').should('have.length', 6);
        cy.get('[data-cy="timeslot"]').eq(5).click();
        DateAndTimeSelectionPage.saveDateSelectionButton(1);
        DateAndTimeSelectionPage.getSelectedDateText(1).should('include', '15:00');

        // filling date for the fourth product
        DateAndTimeSelectionPage.openDateTimeModal(3);
        DateAndTimeSelectionPage.saveDateSelectionButton(3);
        DateAndTimeSelectionPage.getSelectedDateText(3).should('not.be.empty');
        TicketsPage.getContinueButton().should('be.enabled').click();
        QuestionPage.shouldBeVisible();
      });

      /* 7. Questions Page & Validation:
      Action: Navigate to the questions page.
      Action: Attempt to proceed to the next step without filling in any mandatory questions.
      Expected Outcome: A validation error should prevent progression.
      Action: Fill in all mandatory fields on the questions page.
      Expected Outcome: Successfully proceed to the checkout page.
      */
      it('task 7.1: should not be able to proceed to the next step without filling in any mandatory questions', () => {
        QuestionPage.getContinueButton().click();
        QuestionPage.verifyErrorMessage();
      });

      it('task 7.2: should successfully proceed to checkout after filling all mandatory fields', () => {
        QuestionPage.fillMandatoryFields(faker.lorem.sentence());
        QuestionPage.getContinueButton().should('be.enabled').click();

        if (isMobile) {
          ShoppingCartPage.shouldBeVisible();
          ShoppingCartPage.getContinueButton().should('be.enabled').click();
        }
        CheckoutPage.shouldBeVisible();
      });

      /* 8. Checkout Page - Price & Promo Code:
      Action: On the checkout page, verify that the total price in the widget's footer matches the expected amount.
      Action: Enter the promo code "CYPRESSFREE".
      Expected Outcome: Verify that the promo code is applied correctly and the price updates accordingly.
      */
      it('task 8.1: should verify the total price', () => {
        CheckoutPage.getTotalPrice().then((totalPrice) => {
          expect(totalPrice.text()).to.eq(expectedTotalPrice);
        });
      });

      it('task 8.2: should apply the promo code', () => {
        cy.intercept('PATCH', '**/orders/*').as('promoCodeUpdate');
        cy.intercept('GET', '**/orders/*').as('getOrder');
        cy.intercept('PATCH', '**/bookings/*').as('updateBooking');

        cy.fixture('availablePromo').then((promo) => {
          CheckoutPage.fillPromoCode(promo.code);
        });

        cy.wait('@promoCodeUpdate').wait('@updateBooking').wait('@getOrder');
        CheckoutPage.getPromoApprovalButton().should('not.be.visible');
        CheckoutPage.getTotalPrice().then((totalPrice) => {
          expect(totalPrice.text()).to.eq('€0.00');
        });
      });

      /* 9. Finalizing the Order:
      Action: Fill in all mandatory Contact fields.
      Action: Confirm the order.
       Expected Outcome: If all steps are successful, the user should be redirected to a "Success" page showing the paid price.
      */
      it('task 9: should successfully proceed to checkout after filling all mandatory fields', () => {
        cy.fixture('user').then((user) => {
          CheckoutPage.fillContactFields(user.firstName, user.lastName, user.country, user.state);
        });
        CheckoutPage.fillConsentFields();
        CheckoutPage.getContinueButton().click();
        SuccessPaymentPage.shouldBeVisible();
        SuccessPaymentPage.verifyPaidAmount('€0');
      });
    }
  );
});
