import banks from './data/banks.csv'
import mps from './data/mps.csv'
import services from './data/services.yml'
import telcos from './data/telcos.csv'

import i18n from './data/i18n.yml'

import enStates from './data/states.yml'
import bnStates from './locales/bn.yml'
import guStates from './locales/gu.yml'
import hiStates from './locales/hi.yml'
import knStates from './locales/kn.yml'
import mlStates from './locales/ml.yml'
import mrStates from './locales/mr.yml'
import pbStates from './locales/pb.yml'
import taStates from './locales/ta.yml'
import teStates from './locales/te.yml'

import enPetitionBank from './petitions/draft-notice-bank-en.txt';
import mlPetitionBank from './petitions/draft-notice-bank-ml.txt';
import enPetitionGov from './petitions/draft-notice-gov-en.txt';
import mlPetitionGov from './petitions/draft-notice-gov-ml.txt';
import enPetitionTelco from './petitions/draft-notice-telcos-en.txt';
import enPetitionUidai from './petitions/draft-notice-uidai-en.txt';
import hiPetitionUidai from './petitions/draft-notice-uidai-hi.txt';

import bnPetitionMp from './petitions/draft-notice-mp-bn.txt';
import enPetitionMp from './petitions/draft-notice-mp-en.txt';
import hiPetitionMp from './petitions/draft-notice-mp-hi.txt';
import knPetitionMp from './petitions/draft-notice-mp-kn.txt';
import mlPetitionMp from './petitions/draft-notice-mp-ml.txt';
import pbPetitionMp from './petitions/draft-notice-mp-pb.txt';
import taPetitionMp from './petitions/draft-notice-mp-ta.txt';
import tePetitionMp from './petitions/draft-notice-mp-te.txt';

import * as en from './en';

/* Data transformation helpers */

// Deep merge N objects
function merge(...objects) {
  objects = objects.filter(object => typeof object !== 'undefined');

  for (const object of objects) {
    if(typeof object !== 'object' || object === null || Array.isArray(object)) return object;
  }

  const merged = {};
  for (const object of objects) {
    for (const key in object) {
      (merged[key] = merged[key] || []).push(object[key]);
    }
  }
  for (const key in merged) {
    merged[key] = merge(...merged[key]);
  }

  return merged;
}

// Convert an array into an object
function index(array, getKey) {
  const indexed = {};
  for (const object of array) indexed[getKey(object)] = object;
  return indexed;
}

// Convert loaded JSON-frontmatter files
const toPetition = ({ body, attributes }) => ({ body, ...attributes });

// Split MPs up by states
const states = {}
for (const state in enStates) states[state] = { title: enStates[state], targets: {} };
for (const { name, state, mp, email, code } of mps) states[state].targets[code] = {
  name: mp, title: `${name} (${mp})`, to: email
}

const enAll = merge(en, {
  ui: {},
  campaigns: {
    bank: {
      petition: toPetition(enPetitionBank),
      targets: index(banks, bank => bank.ifsc)
    },
    gov: {
      petition: toPetition(enPetitionGov),
      targets: services
    },
    mp: {
      petition: toPetition(enPetitionMp),
      categories: states,
    },
    telcos: {
      petition: toPetition(enPetitionTelco),
      targets: index(telcos, telco => telco.code)
    },
    uidai: {
      petition: toPetition(enPetitionUidai)
    }
  }
});

console.log(enAll);

export default enAll;
