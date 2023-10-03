module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg|css)$': 'identity-obj-proxy',

    // Leaving this commented because it might do something I
    // don't understand, but it doesn't seem like the right way.
    // Replaced with moduleDirectories below which matches the
    // way the application is configured to build.
    // Workaround to enable imports relative to `src`, like
    // `import Providers from 'components/layout/Providers'`
    // '^assets/(.*)$': '<rootDir>/src/assets/$1',
    // '^components/(.*)$': '<rootDir>/src/components/$1',
    // '^cmsHooks/(.*)$': '<rootDir>/src/cmsHooks/$1',
    // '^figma/(.*)$': '<rootDir>/src/figma/$1',
    // '^hooks/(.*)$': '<rootDir>/src/hooks/$1',
    // '^pages/(.*)$': '<rootDir>/src/pages/$1',
    // '^reducers/(.*)$': '<rootDir>/src/reducers/$1',
    // '^storage/(.*)$': '<rootDir>/src/storage/$1',
    // '^templates/(.*)$': '<rootDir>/src/templates/$1',
    // '^utilities/(.*)$': '<rootDir>/src/utilities/$1',
  },
  moduleDirectories: ['node_modules', 'src'],
  setupFilesAfterEnv: ['./test/setupTests.ts', './test/setupEnv.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePaths: ['<rootDir>'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.test.json' }],
  },
}
