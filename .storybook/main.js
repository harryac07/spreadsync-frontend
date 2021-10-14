module.exports = {
  stories: ['../src/storybook/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    // '@storybook/addon-essentials',
  ],
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    typescript: {
      reactDocgen: 'react-docgen-typescript',
      reactDocgenTypescriptOptions: {
        compilerOptions: {
          allowSyntheticDefaultImports: false,
          esModuleInterop: false,
        },
      },
    },
  },
};
