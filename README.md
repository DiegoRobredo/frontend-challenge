# Frontend Challenge – Technical Implementation

This project implements the **Frontend Engineer Challenge**, which requires building a web application to display, create, and manage documents with real-time notifications.  
The solution emphasizes **maintainability, modularity, and scalability** while avoiding large frameworks (React, Angular, etc.), in line with the challenge requirements.

---

## 🚀 Tech Stack and Libraries

### Runtime Dependency

- **[@fortawesome/fontawesome-free](https://fontawesome.com/)** - Provides a consistent and accessible icon set used throughout the UI.

### Development & Build

- **[Vite](https://vitejs.dev/)** – Chosen as the build tool for its speed, modern ES module support, and tight integration with TypeScript.
- **[TypeScript](https://www.typescriptlang.org/)** – Ensures type safety and long-term maintainability.
- **[jiti](https://github.com/unjs/jiti)** – Supports on-demand TypeScript and ESM transpilation, mainly for configuration files.
- **[vite-tsconfig-paths](https://github.com/aleclarson/vite-tsconfig-paths)** – Adds support for `tsconfig.json` path aliases, improving developer ergonomics.

### Testing

- **[Vitest](https://vitest.dev/)** – The official Vite-native test runner. Used for fast and framework-agnostic unit/integration testing.
- **[Cypress](https://www.cypress.io/)** – End-to-end testing framework that simulates real user interactions in the browser.
- **[jsdom](https://github.com/jsdom/jsdom)** – Provides a DOM-like environment for executing Vitest unit tests in Node.js.

### Linting & Formatting

- **[ESLint](https://eslint.org/)** – Enforces code quality and prevents common pitfalls.
- **[@eslint/js](https://www.npmjs.com/package/@eslint/js)** – Provides ESLint’s default rules and configurations.
- **[typescript-eslint](https://typescript-eslint.io/)** – Allows ESLint to parse and apply rules on TypeScript files.
- **[Prettier](https://prettier.io/)** – Maintains consistent code formatting.
- **[eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)** – Disables rules that conflict between ESLint and Prettier.
- **[eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)** – Runs Prettier as an ESLint rule, ensuring formatting is enforced during linting.
- **[globals](https://www.npmjs.com/package/globals)** – Provides predefined global variables for ESLint environments.
- **[lint-staged](https://github.com/okonet/lint-staged)** – Coordinates **ESLint** and **Prettier** checks on staged files only, improving performance and ensuring only changed files are validated.
- **[Husky](https://typicode.github.io/husky/)** – Captures Git hooks (e.g., `pre-commit`) and triggers lint-staged to block commits unless linting and formatting pass.

---

## 🏗️ Project Architecture

The project is structured around **modular Web Components**, each divided into dedicated files (if required) to ensure **separation of concerns** and maintainability:

- **`events.ts`** – Manages all event listeners and handlers.
- **`interface.ts`** – Handles UI changes, DOM attribute updates, and visibility toggling.
- **`logic.ts`** – Encapsulates business logic, ensuring testable and reusable functionality.
- **`data.ts`** – Responsible for parsing, filtering, and ordering data.
- **`index.ts`** – The orchestrator and main entry point of the component, wiring together the other layers.

### Benefits of this structure

- **Scalability** → New features can be introduced without altering the existing layers.
- **Testability** → Business logic and UI can be validated independently.
- **Maintainability** → Clear ownership of responsibilities per file, making it easier for teams to collaborate.

---

## ✅ Testing Strategy

The project adopts a **layered testing approach** to ensure both module correctness and application robustness:

- **Unit & Integration Tests (Vitest)**
    - Validate data parsing, sorting logic, and isolated component behaviors.
    - Executed in a fast Node.js environment with **jsdom** simulating the DOM.

- **End-to-End Tests (Cypress)**
    - Simulate real user flows in a browser environment.
    - Validate the integration of multiple components and APIs.
    - Example flows covered:
        - Displaying the list of documents
        - Receiving real-time WebSocket notifications
        - Creating new documents

- **Unified Testing Command**  
  Both unit/integration and end-to-end tests can be run with a single command:
    ```bash
    npm run test
    ```

---

## 🔒 Code Quality

The project enforces strict quality and consistency standards across the codebase:

- **Pre-commit hooks (Husky)** → Prevents commits unless checks pass.
- **Lint-staged** → Runs ESLint and Prettier only on staged files, improving efficiency.
- **ESLint + typescript-eslint** → Enforces best practices and prevents common pitfalls in both JavaScript and TypeScript.
- **Prettier** → Guarantees consistent code formatting.
- **TypeScript** → Provides type safety and prevents runtime errors.

This workflow ensures **clean, consistent, and maintainable code** throughout the development lifecycle.

---

## 🌐 API & Assumptions

The application integrates with two endpoints provided by the challenge server:

- **`http://localhost:8080/documents`** → HTTP endpoint for fetching documents.
- **`ws://localhost:8080/notifications`** → WebSocket endpoint for receiving real-time notifications.

⚠️ **Important Note:** Document creation is managed **in-memory on the frontend**, since the backend does not expose an API for creating new documents.

---

## ⚖️ Design Decisions & Trade-offs

- **Framework-free approach** → Frameworks like React or Angular could accelerate development but were excluded to align with the challenge requirements and showcase the flexibility of native Web Components.
- **Testing tools** → Selected **Vitest** for speed and tight integration with Vite, combined with **Cypress** for realistic browser-level testing.
- **Code quality enforcement** → **Husky + lint-staged** ensures that linting and formatting rules are applied consistently without slowing down the developer workflow.
- **Icons** → Adopted **Font Awesome** for accessible, standardized, and fast-to-implement icons, avoiding the complexity of building and maintaining a custom SVG system.

---

## ▶️ Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run unit tests
npm run vitest:run

# Run end-to-end tests
npm run cy:open

# Run unit and end-to-end tests
npm run test
```
