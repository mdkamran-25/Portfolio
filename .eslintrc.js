module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals'
  ],
  rules: {
    // Disable unescaped entities as these are common in content
    'react/no-unescaped-entities': 'off',
    // Allow hooks in story functions (common in Storybook)
    'react-hooks/rules-of-hooks': 'off'
  },
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'dist/',
    'build/',
    'storybook-static/',
    'public/'
  ]
};
