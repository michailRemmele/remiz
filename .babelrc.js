module.exports = {
  presets: ['@babel/preset-typescript'],
  plugins: [
    ['@babel/plugin-transform-typescript', { allowDeclareFields: true }],
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-class-properties'
  ]
};
