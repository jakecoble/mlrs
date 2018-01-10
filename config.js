const config = {
  submitSelector: '#submit_app',

  errorSelector: '.field-error-msg',

  regex: {
    'First Name': 'firstName',
    'Last Name': 'lastName',
    'Email': 'email',
    'Phone': 'phone',
    'How did you hear about this job\\?': 'referral'
  },

  user: {
    firstName: 'Jacob',
    lastName: 'Coble',
    email: 'j@kecoble.com',
    phone: '4846249170',
    address: '2627 Piedmont Ave, Berkeley, CA 94704',
    referral: 'Indeed',
    resume: '/home/jake/documents/resume.docx'
  },

  formSelector: 'form[action^="https://boards.greenhouse.io"]'
};

module.exports = config;
