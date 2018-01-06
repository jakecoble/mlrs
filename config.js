const config = {
  applyButtonSelectors: [
    'a#applyButton',
    'a.indeed-apply-button'
  ],

  get applyButtonSelector () {
    return this.applyButtonSelectors.join(', ');
  }
};

module.exports = config;
