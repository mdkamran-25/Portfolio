/**
 * Plop.js Configuration
 * Code generators for maintaining consistency and improving developer experience
 */

export default function (plop) {
  // Component generator
  plop.setGenerator('component', {
    description: 'Generate a new React component with tests and stories',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name:',
        validate: (input) => {
          if (!input) return 'Component name is required';
          if (!/^[A-Z][a-zA-Z0-9]*$/.test(input)) {
            return 'Component name must be PascalCase (e.g., Button, UserProfile)';
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'type',
        message: 'Component type:',
        choices: [
          { name: 'Atom (primitive UI component)', value: 'atom' },
          { name: 'Molecule (composition of atoms)', value: 'molecule' },
          { name: 'Organism (complex component)', value: 'organism' },
          { name: 'Section (layout component)', value: 'section' },
        ],
      },
      {
        type: 'confirm',
        name: 'withTests',
        message: 'Include unit tests?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'withStories',
        message: 'Include Storybook stories?',
        default: true,
      },
    ],
    actions: (data) => {
      const actions = [];
      const basePath = getComponentPath(data.type);
      
      // Main component file
      actions.push({
        type: 'add',
        path: `${basePath}/{{pascalCase name}}/{{pascalCase name}}.tsx`,
        templateFile: 'plop-templates/component.hbs',
      });
      
      // Index file for barrel export
      actions.push({
        type: 'add',
        path: `${basePath}/{{pascalCase name}}/index.ts`,
        templateFile: 'plop-templates/component-index.hbs',
      });
      
      // Tests
      if (data.withTests) {
        actions.push({
          type: 'add',
          path: `${basePath}/{{pascalCase name}}/{{pascalCase name}}.test.tsx`,
          templateFile: 'plop-templates/component-test.hbs',
        });
      }
      
      // Storybook stories
      if (data.withStories) {
        actions.push({
          type: 'add',
          path: `${basePath}/{{pascalCase name}}/{{pascalCase name}}.stories.tsx`,
          templateFile: 'plop-templates/component-stories.hbs',
        });
      }
      
      return actions;
    },
  });

  // Feature generator
  plop.setGenerator('feature', {
    description: 'Generate a new feature module with complete structure',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Feature name (kebab-case):',
        validate: (input) => {
          if (!input) return 'Feature name is required';
          if (!/^[a-z][a-z0-9-]*$/.test(input)) {
            return 'Feature name must be kebab-case (e.g., user-profile, payment-flow)';
          }
          return true;
        },
      },
      {
        type: 'confirm',
        name: 'withState',
        message: 'Include state management (Zustand slice)?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'withApi',
        message: 'Include API service layer?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'withTests',
        message: 'Include feature tests?',
        default: true,
      },
    ],
    actions: (data) => {
      const actions = [];
      const basePath = 'src/features/{{kebabCase name}}';
      
      // Main feature component
      actions.push({
        type: 'add',
        path: `${basePath}/components/{{pascalCase name}}.tsx`,
        templateFile: 'plop-templates/feature-component.hbs',
      });
      
      // Feature index
      actions.push({
        type: 'add',
        path: `${basePath}/index.ts`,
        templateFile: 'plop-templates/feature-index.hbs',
      });
      
      // Types
      actions.push({
        type: 'add',
        path: `${basePath}/types.ts`,
        templateFile: 'plop-templates/feature-types.hbs',
      });
      
      // State management
      if (data.withState) {
        actions.push({
          type: 'add',
          path: `${basePath}/store/{{camelCase name}}.store.ts`,
          templateFile: 'plop-templates/feature-store.hbs',
        });
      }
      
      // API service
      if (data.withApi) {
        actions.push({
          type: 'add',
          path: `${basePath}/services/{{camelCase name}}.service.ts`,
          templateFile: 'plop-templates/feature-service.hbs',
        });
      }
      
      // Feature tests
      if (data.withTests) {
        actions.push({
          type: 'add',
          path: `${basePath}/__tests__/{{kebabCase name}}.feature.test.tsx`,
          templateFile: 'plop-templates/feature-test.hbs',
        });
      }
      
      return actions;
    },
  });

  // Hook generator
  plop.setGenerator('hook', {
    description: 'Generate a new custom React hook with tests',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Hook name (without "use" prefix):',
        validate: (input) => {
          if (!input) return 'Hook name is required';
          if (!/^[A-Z][a-zA-Z0-9]*$/.test(input)) {
            return 'Hook name must be PascalCase (e.g., Payment, LocalStorage)';
          }
          return true;
        },
      },
      {
        type: 'confirm',
        name: 'withTests',
        message: 'Include unit tests?',
        default: true,
      },
    ],
    actions: (data) => {
      const actions = [];
      
      // Hook file
      actions.push({
        type: 'add',
        path: 'src/hooks/use{{pascalCase name}}.ts',
        templateFile: 'plop-templates/hook.hbs',
      });
      
      // Tests
      if (data.withTests) {
        actions.push({
          type: 'add',
          path: 'src/hooks/__tests__/use{{pascalCase name}}.test.ts',
          templateFile: 'plop-templates/hook-test.hbs',
        });
      }
      
      return actions;
    },
  });

  // Helper function to determine component path based on type
  function getComponentPath(type) {
    switch (type) {
      case 'atom':
        return 'src/design-system/primitives';
      case 'molecule':
        return 'src/components/ui';
      case 'organism':
        return 'src/components/common';
      case 'section':
        return 'src/components/sections';
      default:
        return 'src/components';
    }
  }
}
