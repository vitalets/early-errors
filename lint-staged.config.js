module.exports = {
  '**/*.js': ['prettier --write --ignore-unknown', () => 'npm test'],
  '!(**/*.js)': 'prettier --write --ignore-unknown',
};
