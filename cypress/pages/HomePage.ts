class HomePage {
  private selectors = {
    packageButton: '[data-cy="package-product"]',
  } as const;

  getPackageButton() {
    return cy.get(this.selectors.packageButton);
  }

  openPackageProduct() {
    this.getPackageButton().click();
    return this;
  }
}

export default new HomePage();
