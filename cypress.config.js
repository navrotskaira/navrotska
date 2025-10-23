const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    includeShadowDom: true,
    pageLoadTimeout: 20000,
    defaultCommandTimeout: 20000,
    responseTimeout: 20000,
    requestTimeout: 20000,
    watchForFileChanges: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    setupNodeEvents(on, config) {
      config.baseUrl = config.env.baseUrl;
    },
  },
});
