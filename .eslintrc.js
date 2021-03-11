module.exports = {
  env: {
    node: true,
    es2020: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['prettier', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': [
      'warn',
      {
        fixToUnknown: false,
        ignoreRestArgs: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-use-before-define': ['error', { variables: false }],
    '@typescript-eslint/no-var-requires': 'off',
    camelcase: 'off',
    'no-use-before-define': 'off',
    'standard/no-callback-literal': 'off',
    'prettier/prettier': 'error',
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
}
