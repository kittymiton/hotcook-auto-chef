module.exports = {
  parser: '@typescript-eslint/parser', // TypeScript文法を正しく解釈
  plugins: ['@typescript-eslint'], // 追加ルール集を使う
  extends: ['plugin:@next/next/recommended'], // 推奨ルールセットを読み込む
  rules: {
    // '@typescript-eslint/explicit-function-return-type': [
    //   // 戻り値の型
    //   'warn',
    //   {
    //     allowExpressions: true, // 式による関数には戻り値の型を書かなくても警告しない
    //     allowTypedFunctionExpressions: true, // すでに型注釈された関数型の代入には、戻り値の型を明示しなくてもOK
    //   },
    // ],
    '@typescript-eslint/explicit-function-return-type': 'off', // off
    '@typescript-eslint/no-explicit-any': 'warn', // any型
  },
};
