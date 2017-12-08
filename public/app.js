var banks = window.banks;
var services = window.services;

// This is the method that generates a response
var makeResponse = function() {};

// TODO: convert following methods to vue
var emailContent = function(address) {
  var content = document.getElementById('draft-notice-dept').innerText;
  return address + '\n\n' + content;
};

var IEMobile = /IEMobile/i.test(navigator.userAgent);
var isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(
    navigator.userAgent
  ) && !IEMobile;

var sendEmailMobile = function(toAddress, subject, bccAddress, encodedBody) {
  window.location.href =
    'mailto:' +
    encodeURIComponent(toAddress) +
    '?subject=' +
    encodeURIComponent(subject) +
    '&bcc=' +
    encodeURIComponent(bccAddress) +
    '&body=' +
    encodedBody;
  window.location.hash = '#share';
};

var sendEmail = function() {
  // var to, subject, bcc, body

  var encodedBody = encodeURIComponent(body);

  if (isMobile) {
    sendEmailMobile(to, subject, bcc, encodedBody);
    return false;
  } else {
  }
};

var app = new Vue({
  delimiters: ['<%', '%>'],
  el: '#resist-form',
  data: {
    serviceIndex: 0,
    bankIndex: 0,
  },
  computed: {
    banks: function() {
      return window.banks;
    },
    services: function() {
      return window.services;
    },
    service: function() {
      return this.services[this.serviceIndex];
    },
    bank: function() {
      return this.banks[this.bankIndex].name;
    },
    email: function() {
      var e;
      switch (this.service.name) {
        case 'Bank':
          e = banks[this.bankIndex].email;
          break;
        default:
          e = services[this.serviceIndex].email;
          break;
      }

      // email cleanup
      return e
        .replace(/[\[\(]dot[\]\)]/g, '.')
        .replace(/[\[\(]at[\]\)]/g, '@')
        .replace(/[\n\r]/g, ', ')
        .replace(', , ', ', ');
    },
    response: makeResponse,
  },
});
