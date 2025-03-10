export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Transform JavaScript files with Babel
  },
  setupFilesAfterEnv: ['./jest-setup.mjs'], // Include setup file for global polyfills
};
