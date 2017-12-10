var banks = window.banks;
var services = window.services;

// Handle google-analytics blocks gracefully
if (!window.gtag) {
  window.gtag = function() {};
}

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
  locale: window.localStorage.getItem('locale') || 'en',
  messages: i18nMsgs,
  fallbackLocale: 'en'
});

var app = new Vue({
  i18n: i18n,
  delimiters: ['[{', '}]'],
  el: '#app',
  data: {
    locale: 'en',
    serviceIndex: 0,
    bankIndex: 0,
    state: 'AN',
    constituencyIndex: 0,
    mps: [],
    constituencies: [],
    campaign: 'mp',
    templates: {
      mp: '',
      bank: '',
      service: ''
    }
  },
  methods: {
    setLocale: function(val) {
      gtag('event', 'setLocale', {
        lang: val
      });
      this.$i18n.locale = val;
      window.localStorage.setItem('locale', val);
    },
    sendEmail: function() {
      gtag('event', 'sendEmail', {
        email: this.email,
        subject: this.subject,
        bcc: this.bcc,
        mobile: this.mobile
      });

      var encodedBody = encodeURIComponent(this.response);

      if (this.mobile) {
        sendEmailMobile(this.email, this.subject, this.bcc, encodedBody);
        return false;
      } else {
        //TODO: desktop email (show copy paste instructions!)
        sendEmailMobile(this.email, this.subject, this.bcc, encodedBody);
      }
    },
    tweet: function() {
      gtag('event', 'sendTweet');
    },
    updateConstituencies: function() {
      var self = this;

      this.constituencies = this.mps.filter(function(mp) {
        return mp.state === self.state;
      });
    }
  },
  watch: {
    state: function(newState) {
      this.updateConstituencies();
    },
    constituencyIndex: function(newIndex) {
      var c = this.constituencies[newIndex];
    },
    locale: function(newLocale) {
      this.setLocale(newLocale);
    }
  },
  created: function() {
    // We fetch the extra resources here, if needed
    if (document.location.pathname === '/mp/') {
      this.campaign = 'mp';
    } else if (document.location.pathname === '/service/') {
      this.campaign = 'service';
    }

    this.locale = window.localStorage.getItem('locale') || 'en';

    var self = this;

    switch (this.campaign) {
      case 'mp':
        this.$http
          .get('/public/mps.json', { responseType: 'json' })
          .then(function(response) {
            this.mps = response.body;
            this.updateConstituencies();
          });

        this.templates.mp = document.getElementById(
          'draft-notice-mp'
        ).innerText;
        break;

      case 'service':
        this.templates.service = document.getElementById(
          'draft-notice-service'
        ).innerText;
        this.templates.bank = document.getElementById(
          'draft-notice-bank'
        ).innerText;
        break;
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
    constituency: function() {
      return this.constituencies[this.constituencyIndex];
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
      switch (this.campaign) {
        case 'service':
          if (this.serviceIndex === 0) {
            return this.banks[this.bankIndex];
          }

          return this.services[this.serviceIndex];
          break;
        case 'mp':
          var e = '',
            a = '';
          if (this.constituency) {
            e = this.constituency.email;
            a = this.constituency.name;
          }
          return {
            email: e,
            address: a
          };
      }
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
        .replace(';', ',')
        .replace(/[\[\(]dot[\]\)]/g, '.')
        .replace(/[\[\(]at[\]\)]/g, '@')
        .replace(/[\n\r]/g, ', ')
        .replace(', , ', ', ');
    },
    response: function() {
      var template;

      switch (this.campaign) {
        case 'service':
          if (this.serviceIndex === 0) {
            return this.templates.bank;
          }
          return this.templates.service.trim();
          break;
        case 'mp':
          // TODO: Somehow interpolate the current scope
          // into this as a template, so we can use {{service.name}}
          // inside the template
          return this.templates.mp.trim();
          break;
      }
    }
  }
});
