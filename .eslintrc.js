module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ['plugin:vue/essential', '@vue/prettier'],
    rules: {
        'no-console': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-unused-vars': 1, // 申明后不适用提示
        // indent: [2, 4, 8], //缩进风格
        'no-const-assign': 2, //禁止修改const声明的变量
        'no-cond-assign': 'off', //禁止在条件表达式中使用赋值语句
        'no-useless-escape': 'off', //禁止不必要的转义字符
        'no-alert': 2,
        'no-var': 2,
        // eqeqeq: 2 //始终使用 === 替代 ==。obj == null 可以用来检查 null || undefined。
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
};
