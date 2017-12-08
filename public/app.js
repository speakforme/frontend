var banks = window.banks;
var services = window.services;

// This is the method that generates a response
var makeResponse = function() {};

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
      switch (this.service.name) {
        case 'Bank':
          return banks[this.bankIndex].email;
          break;
        default:
          return services[this.serviceIndex].email;
          break;
      }
    },
    response: makeResponse,
  },
});
