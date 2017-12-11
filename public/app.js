var banks = window.banks;
var services = window.services;
var templates = {}
var responseComponents = {}

// forEach method, could be shipped as part of an Object Literal/Module
var forEach = function(array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]); // passes back stuff we need
  }
};

// Handle google-analytics blocks gracefully
if (!window.gtag) {
  window.gtag = function() {};
}

var i18n = new VueI18n({
  locale: window.localStorage.getItem('locale') || 'en',
  messages: i18nMsgs,
  fallbackLocale: 'en'
});

forEach(document.querySelectorAll('script[id^=draft-notice-]'), function(
  index,
  el
) {
  var key = el.id.substr('draft-notice-'.length);
  templates[key] = el.innerText;

  responseComponents[key] = {
    props: [
      'addressee',
      'address',
      'body'
    ],
    delimiters: ['((', '))'],
    template:
    '<textarea @copy="copied" cols="70" rows="10" name="content" id="response-content">' +
    templates[key] +
    '</textarea>',
    methods: {
      copied: function () {
        this.$emit('copied')
      }
    }
  }
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
    },
    showcopymsg: false
  },
  methods: {
    setLocale: function(val) {
      gtag('event', 'setLocale', {
        lang: val
      });
      this.$i18n.locale = val;
      window.localStorage.setItem('locale', val);
    },
    openMailLink: function(encodedBody, method) {
      var base = 'mailto:',
        subject = 'subject',
        bcc = 'bcc';

      switch (method) {
        case 'gmail':
          base =
            'https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&source=mailto&to=';
          subject = 'su';
          break;
        case 'yahoo':
          base = 'http://compose.mail.yahoo.com/?To=';
          subject = 'Subject';
          to = 'To';
          bcc = 'Bcc';
          break;
      }

      // TODO: use string interpolation after switching to es6
      var url =
        base +
        encodeURIComponent(this.email) +
        '?' +
        subject +
        '=' +
        encodeURIComponent(this.subject) +
        '&' +
        bcc +
        '=' +
        encodeURIComponent(this.bcc) +
        '&body=' +
        encodedBody;

      if (this.mobile) {
        window.location.href = url;
      } else {
        // Open in new tab
        // TODO: Make the btn-email-desktop
        // into a <a href> with dynamic link and new tab opening
        window.location.href = url;
      }
    },
    /**
     * On mobiles, we show 3 buttons for gmail/yahoo/mailto
     * since long links work properly there with intents
     *
     * On desktops (and IE Mobile) we
     * - try to copy the text automatically
     * - show a message asking user to paste it
     * - and then open the mail client to let the user paste it
     */
    sendEmail: function(method) {
      gtag('event', 'sendEmail', {
        email: this.email,
        subject: this.subject,
        bcc: this.bcc,
        mobile: this.mobile,
        method: method
      });

      var encodedBody = encodeURIComponent(this.response);

      if (this.mobile) {
        this.openMailLink(encodedBody, method);
      } else {
        var responseEl = document.querySelector('#response-content');
        responseEl.select();
        try {
          timeout = 1000;
          var successful = document.execCommand('copy');
          if (successful) {
            return;
          } else {
            // Ask user to copy
            this.showcopymsg = true;
          }
        } catch (err) {
          this.showcopymsg = true;
        }
      }
    },
    copied: function() {
      alert('The message is now copied, paste it in your mail client');
      this.openMailLink('Paste+here');
    },
    tweet: function() {
      gtag('event', 'sendTweet');
    },
    updateConstituencies: function() {
      var self = this;

      this.constituencies = this.mps.filter(function(mp) {
        return mp.state === self.state;
      });
    },
    initTemplates: function() {
      var self = this;
      self.templates = templates
    },
    // We have 3 values for the campaign:
    // mp/service/bank
    setInitialCampaign: function() {
      // TODO: Use the page template to export a variable
      if (document.location.pathname === '/mp/') {
        this.campaign = 'mp';
      } else if (document.location.pathname === '/service/') {
        this.campaign = 'service';
      }
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
    },
    serviceIndex: function(i) {
      if (i === 'bank') {
        this.campaign = 'bank';
      } else {
        this.campaign = 'service';
      }
    }
  },
  created: function() {
    this.locale = window.localStorage.getItem('locale') || 'en';

    var self = this;

    this.initTemplates();

    this.setInitialCampaign();

    switch (this.campaign) {
      case 'mp':
        this.$http
          .get('/public/mps.json', { responseType: 'json' })
          .then(function(response) {
            this.mps = response.body;
            this.updateConstituencies();
          });

        break;

      case 'service':
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
      // UCBrowser etc?
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
      switch (this.campaign) {
        case 'bank':
          return 'Threats to make bank accounts inoperable without Aadhaar';
        case 'service':
          return (
            'Threats to make ' +
            this.service.name +
            ' inoperable without Aadhaar'
          );
        case 'mp':
          return 'An appeal to raise my concerns regarding Aadhaar in Winter Session of Parliament';
      }
    },
    service: function() {
      switch (this.campaign) {
        case 'bank':
          return this.banks[this.bankIndex];
        case 'service':
          return this.services[this.serviceIndex];
          break;
        // TODO: fix this hacky code by making constituency
        // schema same as service/bank
        case 'mp':
          var e = '',
            a = '';
          if (this.constituency) {
            e = this.constituency.email;
            a = this.constituency.name;
          }
          return {
            email: e,
            address: a,
            name: a
          };
      }
    },
    bank: function() {
      return this.banks[this.bankIndex];
    },
    personName: function() {
      switch (this.campaign) {
        case 'bank':
          return 'Chairman and MD (' + this.bank.name + ')';
        case 'mp':
          return this.serviceName;
        case 'service':
          return this.service.personName;
      }
    },
    serviceName: function() {
      return this.service.name;
    },
    email: function() {
      var e = this.service.email;

      var self = this;
      // email cleanup
      // TODO: TRIM trailing commas
      return e
        .replace(';', ',')
        .replace(/[\[\(]dot[\]\)]/g, '.')
        .replace(/[\[\(]at[\]\)]/g, '@')
        .replace(' ', ',')
        .split(',')
        .filter(function(t) {
          return t.trim().length > 0;
        })
        .map(function(e) {
          return self.personName + ' <' + e + '>';
        })
        .join(', ');
    },
    response: function() {
      var template;

      switch (this.campaign) {
        case 'bank':
          return this.templates.bank.trim();
        case 'service':
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
  },
  components: responseComponents
});
