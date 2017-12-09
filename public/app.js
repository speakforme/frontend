var banks = window.banks;
var services = window.services;

var templates = {
  service: document.getElementById('draft-notice-service').innerText,
  bank: document.getElementById('draft-notice-bank').innerText
};

// TODO: convert following method to vue

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

var i18n = new VueI18n({
  locale: 'hi',
  messages: i18nMsgs
});

var app = new Vue({
  i18n: i18n,
  delimiters: ['[{', '}]'],
  el: '#app',
  data: {
    serviceIndex: 0,
    bankIndex: 0,
    state: 'AN',
    constituency: 'Andaman and Nicobar Islands',
    mps: []
  },
  methods: {
    sendEmail: function() {
      var encodedBody = encodeURIComponent(this.response);

      if (this.mobile) {
        sendEmailMobile(this.email, this.subject, this.bcc, encodedBody);
        return false;
      } else {
        //TODO: desktop email (show copy paste instructions!)
        sendEmailMobile(this.email, this.subject, this.bcc, encodedBody);
      }
    },
    tweet: function() {}
  },
  ready: function() {
    // We fetch the extra resources here, if needed
    if (document.location.pathname === '/mp/') {
      this.$http.get('/public/mps.json').then(function(response) {
        this.$set('mps', response.data);
      });
    }
  },
  computed: {
    tweettext: function() {
      // TODO: localize this as well
      // TODO: find a better twitter message
      return encodeURIComponent(
        'Hey ' +
          this.twitter +
          ', please stop harrassing me for my aadhaar. @speakforme'
      );
    },
    states: function() {
      return [
        'AN',
        'AP',
        'AR',
        'AS',
        'BI',
        'CH',
        'CT',
        'DN',
        'DD',
        'DL',
        'GO',
        'GJ',
        'HA',
        'HP',
        'JK',
        'JH',
        'KA',
        'KE',
        'LD',
        'MP',
        'MH',
        'MA',
        'ME',
        'MI',
        'NA',
        'OR',
        'PO',
        'PB',
        'RJ',
        'SK',
        'TG',
        'TN',
        'TR',
        'UP',
        'UT',
        'WB'
      ];
    },
    tweeturl: function() {
      return 'https://twitter.com/intent/tweet?text=' + this.tweettext;
    },
    mobile: function() {
      var IEMobile = /IEMobile/i.test(navigator.userAgent);

      // TODO: check needs to be more robust
      return (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(
          navigator.userAgent
        ) && !IEMobile
      );
    },
    banks: function() {
      return window.banks;
    },
    services: function() {
      return window.services;
    },
    bcc: function() {
      // TODO: Generate <campaign-code>@speakforme.in email address
      return 'info@speakforme.in';
    },
    twitter: function() {
      if (this.service.twitter) {
        return this.service.twitter
          .split(' ')
          .map(function(handle) {
            return '@' + handle;
          })
          .join(' ');
      }
      return false;
    },
    subject: function() {
      if (this.serviceIndex === 0) {
        return 'Threats to make bank accounts inoperable without Aadhaar';
      }
      return (
        'Threats to make ' + this.service.name + ' inoperable without Aadhaar'
      );
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
    // Find all the constituencies for the current state
    constituencies: function() {
      return this.mps
        .filter(function(mp) {
          return mp.state === this.state;
        })
        .map(function(mp) {
          return mp.cons;
        });
    },
    response: function() {
      var template;
      if (this.serviceIndex === 0) {
        return templates.bank;
      }

      // TODO: Somehow interpolate the current scope
      // into this as a template, so we can use {{service.name}}
      // inside the template
      return templates.service;
    }
  }
});
