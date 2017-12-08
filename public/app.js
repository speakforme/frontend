var banks = window.banks;
var services = window.services;

var templates = {
  service: document.getElementById('draft-notice-service').innerText,
  bank: document.getElementById('draft-notice-bank').innerText,
};

// TODO: convert following methods to vue
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
      if (this.serviceIndex === 0) {
        return this.banks[this.bankIndex];
      }

      return this.services[this.serviceIndex];
    },
    bank: function() {
      return this.banks[this.bankIndex];
    },
    serviceName: function() {
      return this.service.name;
    },
    email: function() {
      var e = this.service.email;

      // email cleanup
      return e
        .replace(/[\[\(]dot[\]\)]/g, '.')
        .replace(/[\[\(]at[\]\)]/g, '@')
        .replace(/[\n\r]/g, ', ')
        .replace(', , ', ', ');
    },
    response: function() {
      var template;
      if (this.serviceIndex === 0) {
        return templates.bank;
      }
      return templates.service;
    },
  },
});
