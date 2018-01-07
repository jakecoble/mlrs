const config = {
  submitSelector: '#submit_app',

  errorSelector: '.field-error-msg',

  mapping: {
    'input#first_name': 'firstName',
    'input#last_name': 'lastName',
    'input#email': 'email',
    'input#phone': 'phone',
    'form#s3_upload_for_resume>input[type=file]': 'resume',
    '#job_application_answers_attributes_0_text_value': 'address',
    '#job_application_answers_attributes_3_text_value': 'referral'
  },

  user: {
    firstName: 'Jacob',
    lastName: 'Coble',
    email: 'j@kecoble.com',
    phone: '4846249170',
    address: '2627 Piedmont Ave, Berkeley, CA 94704',
    referral: 'Indeed',
    resume: '/home/jake/documents/resume.docx',

    get fullName () {
      return this.firstName + ' ' + this.lastName;
    }
  },

  formCheckSelector: 'form[action^="https://boards.greenhouse.io"]'
};

module.exports = config;
