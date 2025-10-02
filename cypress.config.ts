import { defineConfig } from 'cypress'

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        specPattern: '__tests__/e2e/**/*.cy.{js,jsx,ts,tsx}',
        baseUrl: 'http://localhost:5173',
        supportFile: '__tests__/e2e/support/e2e.ts',
        fixturesFolder: '__tests__/e2e/fixtures',
        screenshotsFolder: '__tests__/e2e/screenshots',
        videosFolder: '__tests__/e2e/videos',
    },
})
