const config = {
  applyButtonSelectors: [
    'a#applyButton',
    'a.indeed-apply-button'
  ],

  _mapping: {
    fullName: ['input#input-applicant\.name', 'input[name=firstName]'],
    email: ['input[name=emailAddress]'],
    phone: ['input[data-form-error-label=phoneNumber]']
  },

  _user: {
    firstName: 'Jacob',
    lastName: 'Coble',
    email: 'j@kecoble.com',
    phone: '4846249170',

    get fullName () {
      return this.firstName + ' ' + this.lastName;
    }
  },

  _data: {},

  get formSelectors () {
    var selectors = [];

    for (let userInfo in this._mapping) {
      selectors = selectors.concat(this._mapping[userInfo]);
    }

    return selectors;
  },

  dataForSelector (selector) {
    return this._data[selector];
  }
};

for (let userInfo in config._mapping) {
  var selectors = config._mapping[userInfo];

  selectors.forEach(s => {
    config._data[s] = config._user[userInfo];
  });
}

module.exports = config;
