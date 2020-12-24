module.exports = {
  root: true,
  env: {
    node: true
  },
  // 使用插件的编码规则
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  // 自定义编码校验规则
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "standard/no-callback-literal": [0, ["cb", 'callback']],
    '@typescript-eslint/member-delimiter-style': [
      2,
      {
        multiline: {
          delimiter: 'none',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    "@typescript-eslint/no-explicit-any": ["off"],
    'indent': [2, 2, {
      'SwitchCase': 1
    }],
  }
}
