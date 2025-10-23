# Business Case

This project delivers a Cypress test automation solution for the NYC Icons Express booking flow.The complete booking journey was automated - from selecting the package to completing payment.

The complete booking journey was automated - from selecting the "NYC Icons Express - 1 Day Adventure" package to completing payment. The solution covers:

- **All 9 required user journey steps**, including edge cases and error scenarios
- **Cross-platform testing** - every test runs on both desktop (1920x1080) and mobile (390x844) viewports. Viewport-specific logic handles the key difference where mobile users navigate through an explicit Shopping Cart page between Questions and Checkout, while desktop users transition directly from Questions to Checkout. This ensures testing matches what users actually experience on each platform.
- **24 automated test cases** that validate critical paths: ticket selection, date/time booking, form validation, promo codes, and order confirmation

## Architecture Decision

The booking flow is implemented as a single test suite with `{ testIsolation: false }`. This choice reflects a real user journey where each step naturally flows into the next. Breaking this into isolated tests would result in loss of true end-to-end validation.

### Task Completion

Each test maps directly to requirements. Every scenario from the task list has corresponding test coverage, documented in the test descriptions.

### Test Stability

Tests have been validated through multiple runs across different days and times. Strategic waits, API intercepts, and conditional logic handle real-world variability.

### Maintenance

Each page has a dedicated class containing all its selectors and user interactions. In case any UI element change, the fix would happen in one location inside the Page Object class. This reduces maintenance time when developers refactor the UI.

---

# Questions & Observations

During development, several behaviors occurred that would require additional discussion:

### 1. Date Edit Limitation

**Observed behavior:** When a date is selected for "Empire State Building – Observatory Admission" and then edited, only that same date remains available. All other dates become inactive. From a user perspective, correcting a date selection mistake requires restarting the checkout process completely.

**Question:** Is this intentional behavior, or a UX issue to address?

### 2. Time Slot Availability

**Observed behavior:** Time slot selection is available for "Madame Tussauds New York" but not for "Statue of Liberty & Ellis Island Ferry Tour". The current test implementation checks for each product individually to avoid flaky tests.

**Question:** Is this expected based on product configuration? If it's a bug, a generic approach that conditionally handles timeslot selection only when the element [data-cy="include-optional"] does not exist would be more maintainable.

---

# Opportunities for improvement

## Test Selectors

The `data-cy` attributes throughout the application show significant room for standardization.

**Current inconsistencies observed:**

- Attributes with spaces and capitals: `[data-cy-title="Date and Time"]`. Recommended pattern is to use kebab-case for all values.
- Localized/translated values, e.g., `data-cy="ticket-unit-Dospělý-price"` (contains the Czech word for "Adult"). Different language versions need separate selectors.
- Dynamic IDs appear for the question form. This required workarounds with prefix matching (e.g., `[data-cy^="question-true"]`). Keeping values static is recommended.

## Currency Handling

The current implementation shows EUR as the only available currency in the UI (preselected and disabled). The price calculation logic in `helpers.ts` includes an `exchangeRate` parameter as preparation in case the product adds support for multiple currencies. Currently set to `1` (EUR to EUR) since the UI only displays EUR as the available currency option.

# Installation and Execution

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

## Setup

```bash
# Clone the repository
git clone https://github.com/navrotskaira/navrotska
cd navrotska

# Install dependencies
npm install
```

Create a `cypress.env.json` file in the project root with the following content:

```json
{
  "baseUrl": "http://localhost:8080"
}
```

**Note:** This file is gitignored and will not be committed to the repository. Each developer should create their own copy.

## Running Tests

### 1. Start Local Server

The application requires a local HTTP server hosting the booking widget:

```bash
# Start server on port 8080
npx http-server -p 8080
```

**Note:** Keep this terminal session running while executing tests

To stop the server:

```bash
# Kill process on port 8080
kill -9 $(lsof -ti:8080)
```

### 2. Execute Cypress Tests

**Interactive Mode** (recommended for development):

```bash
npx cypress open
```

Select E2E Testing → Choose your browser → Run desired spec files

**Headless Mode** (for CI/CD):

```bash
npx cypress run
```

**Run specific test suite:**

```bash
npx cypress run --spec "cypress/e2e/bookingHappyPath.cy.ts"
npx cypress run --spec "cypress/e2e/dateSelectionScenarios.cy.ts"
```

---

# Project Structure

The codebase follows the **Page Object Model (POM)** pattern - each page has its own class with methods representing user interactions. This separation makes tests readable and maintainable, with changes to UI selectors requiring updates in only one location.

```
navrotska/
├── cypress/
│   ├── e2e/                              # Test specifications
│   │   ├── bookingHappyPath.cy.ts        # Main happy path test suite
│   │   └── dateSelectionScenarios.cy.ts  # Date/time selection edge cases
│   │
│   ├── fixtures/                         # Test data
│   │   ├── availablePromo.json           # Promo code test data
│   │   └── user.json                     # User information test data
│   │
│   ├── pages/                            # Page Object Model classes
│   │   ├── CheckoutPage.ts               # Checkout form interactions
│   │   ├── DateAndTimeSelectionPage.ts   # Date&time modal handling
│   │   ├── HomePage.ts                   # Landing page interactions
│   │   ├── Modal.ts                      # Generic modal utilities
│   │   ├── QuestionPage.ts               # Customer questions form
│   │   ├── ShoppingCartPage.ts           # Cart page (mobile flow)
│   │   ├── SuccessPaymentPage.ts         # Order confirmation page
│   │   └── TicketsPage.ts                # Ticket selection page
│   │
│   ├── screenshots/                      # Test failure screenshots
│   │
│   └── support/                          # Cypress configuration & helpers
│       ├── commands.ts                   # Custom Cypress commands
│       ├── constants.ts                  # Test constants (URLs, selectors)
│       ├── e2e.ts                        # Cypress initialization
│       └── helpers.ts                    # Utility functions
│
├── cypress.config.js                     # Cypress configuration
├── cypress.env.json                      # Environment variables (gitignored, create locally)
├── index.html                            # Application entry point
├── package.json                          # Project dependencies
├── tsconfig.json                         # TypeScript configuration
├── task.md                               # Original task requirements
└── README.md                             # Project documentation
```
