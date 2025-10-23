export class Modal {
  private selectors = {
    container: '[data-cy="checkout-modal-pop-up"]',
    title: (name: string) => `[data-cy-title="${name}"]`,
    continueButton: '[data-cy="footer-button"]',
    languageSelect: '[data-cy="settings-button"]',
    languageBox: '#LanguageListBox',
    settingsConfirmButton: '[data-cy="settings-confirm-button"]',
  } as const;

  getModal() {
    return cy.get(this.selectors.container);
  }

  getTitle(titleName: string) {
    return cy.get(this.selectors.title(titleName));
  }

  getContinueButton() {
    return cy.get(this.selectors.continueButton);
  }

  getSettingsConfirmButton() {
    return cy.get(this.selectors.settingsConfirmButton);
  }

  changeLanguage(language: string) {
    cy.get(this.selectors.languageSelect).click();
    cy.get(this.selectors.languageBox)
      .click()
      .find('[data-cy="option-name"]')
      .contains(language)
      .click();
    this.getSettingsConfirmButton().click();
  }
}
