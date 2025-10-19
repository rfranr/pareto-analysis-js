/**
 * Vitest setup file for common test utilities and global mocks
 */
import { expect } from "vitest";

// Global test utilities
global.testUtils = {
  createMockStatsData: (repoName = "test-repo", features = {}) => ({
    [repoName]: {
      totals: {
        files: 10,
        loc: 1000,
        features: {
          "ArrayMethods.map": 20,
          ArrowFunctions: 15,
          TemplateLiterals: 10,
          ...features,
        },
      },
    },
  }),

  createMockJSCode: (type = "modern") => {
    const codeTemplates = {
      modern: `
        import React from 'react';
        const Component = ({ data }) => {
          const items = data?.map(item => ({
            ...item,
            processed: true
          }));
          return <div>{items.length} items</div>;
        };
        export default Component;
      `,
      legacy: `
        function processData(data) {
          var result = [];
          for (var i = 0; i < data.length; i++) {
            result.push(data[i]);
          }
          return result;
        }
        module.exports = processData;
      `,
      typescript: `
        interface User {
          id: number;
          name: string;
        }
        class UserService implements ServiceInterface {
          private users: User[] = [];
          public getUser(id: number): User | undefined {
            return this.users.find(user => user.id === id);
          }
        }
      `,
      async: `
        async function fetchUserData(userId) {
          try {
            const response = await fetch(\`/api/users/\${userId}\`);
            const userData = await response.json();
            return userData;
          } catch (error) {
            console.error('Failed to fetch user data:', error);
            throw error;
          }
        }
      `,
    };
    return codeTemplates[type] || codeTemplates.modern;
  },
};

// Common test matchers
expect.extend({
  toBeValidFeatureName(received) {
    const isValid =
      typeof received === "string" &&
      received.length > 0 &&
      /^[A-Za-z][A-Za-z0-9._-]*$/.test(received);

    return {
      message: () => `expected ${received} to be a valid feature name`,
      pass: isValid,
    };
  },

  toHaveValidStatsStructure(received) {
    const hasValidStructure =
      received &&
      typeof received === "object" &&
      received.totals &&
      typeof received.totals.files === "number" &&
      typeof received.totals.loc === "number" &&
      received.totals.features &&
      typeof received.totals.features === "object";

    return {
      message: () =>
        `expected ${JSON.stringify(received)} to have valid stats structure`,
      pass: hasValidStructure,
    };
  },
});

// Setup console spy to avoid noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

afterEach(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global error handler for unhandled promises
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
