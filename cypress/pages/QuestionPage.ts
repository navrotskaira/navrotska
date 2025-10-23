import { TITLE_NAMES } from '../support/constants';
import { Modal } from './Modal';
class QuestionPage extends Modal {
  private QuestionSelectors = {
    bookingQuestionTextArea: '[data-cy^="question-true"] textarea',
    bookingQuestionSelect: '[data-cy^="question-true"] [data-cy="select-wrapper"]',
    bookingQuestionSelectList: '[data-cy="select-options"]',
    bookingQuestionSelectOption: '[data-cy="select-option--one"]',
    childPresenceCheckbox: '[data-cy^="question-true"] [type="checkbox"]',
    requiredFields: '[data-cy^="question-true"]',
    errorMessage: '[data-cy$="-error"]',
  } as const;

  shouldBeVisible() {
    this.getTitle(TITLE_NAMES.questions).should('exist');
    return this;
  }

  getBookingQuestionTextArea() {
    return cy.get(this.QuestionSelectors.bookingQuestionTextArea);
  }

  getBookingQuestionSelect() {
    return cy.get(this.QuestionSelectors.bookingQuestionSelect);
  }

  getBookingQuestionSelectList() {
    return cy.get(this.QuestionSelectors.bookingQuestionSelectList);
  }

  childPresenceCheckbox() {
    return cy.get(this.QuestionSelectors.childPresenceCheckbox);
  }

  getBookingQuestionSelectOption() {
    return this.getBookingQuestionSelectList()
      .should('be.visible')
      .should('not.have.css', 'visibility', 'hidden')
      .find(this.QuestionSelectors.bookingQuestionSelectOption);
  }

  verifyErrorMessage() {
    cy.get(this.QuestionSelectors.requiredFields).each((field) => {
      cy.wrap(field).find(this.QuestionSelectors.errorMessage).should('exist');
    });
    return this;
  }

  fillMandatoryFields(textAnswer: string) {
    this.getBookingQuestionTextArea().type(textAnswer).should('have.value', textAnswer);
    this.getBookingQuestionSelect().click();
    this.getBookingQuestionSelectOption().first().click();
    this.childPresenceCheckbox().each(($checkbox) => {
      cy.wrap($checkbox).should('be.visible').click();
      cy.wrap($checkbox).should('be.checked');
    });
  }
}

export default new QuestionPage();
