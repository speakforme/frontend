/*
  What are we doing here?

  This contains all the data of

  This file is a (hopefully) temporary shim that takes data files in the
  original formats and converts them into the consistent campaigns schema.

  The schema docs are at the bottom of this file.

  Ideally, the strings should be moved into a Google Spreadsheet, with
  the build script pulling down CSVs before running WebPack.
*/

import * as en from './en';

// TODO: Add here as new strings are translated.
const newStrings = { en };

// load assets using WebPack hackery.
function requireAll(ctx) {
  const data = {};
  const files = ctx.keys();
  files.forEach(file => data[file.split(/[./]/g)[2]] = ctx(file));
  return data;
}

const {states, mps, banks, services, telcos, i18n} = requireAll(require.context(`./data/`, true));
const locales = requireAll(require.context(`./locales/`, true));
const petitions = requireAll(require.context(`./petitions/`, true));

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

// Convert an array into a hashmap
function index(array, getKey) {
  const indexed = {};
  for (const object of array) indexed[getKey(object)] = object;
  return indexed;
}

// Convert loaded JSON-frontmatter files
function getPetition(lang, campaign) {
  const loc = petitions[`draft-notice-${campaign}-${lang}`];
  const en = petitions[`draft-notice-${campaign}-en`];
  return merge(
    loc || {},
    en,
    loc ? { body: `${loc.body}\n\nEnglish Version:\n\n${en.body}` } : {}
  );
}

// Add variables like "addressee" to use for template replacement.
// We consistently use "name" to refer to the person, and "title"
// for the select option (if different from name).
// All variables here can be used for addressing.
function addVariables(targets) {
  for (const id in targets) {
    const target = targets[id];
    if (target.personName) {
      if (target.name) target.title = target.name;
      target.name = target.personName;
    }
    if (!target.code) target.code = id;
    if (!target.addressee && target.name) target.addressee = target.name;
  }
  return targets;
}

const getText = (lang, type, code) =>
  locales[lang] && locales[lang][type] && locales[lang][type][code];

export function getStrings(lang) {
  // Categorize MPs up by states
  const cats = {};
  for (const state in states) cats[state] = {
    title: getText(lang, 'states', state) || states[state],
    targets: {}
  };

  for (const { name, state, mp, email, code } of mps) cats[state].targets[code] = {
    name: mp, email,
    title: `${getText(lang, 'constituencies', code) || name} (${mp})`,
  }

  return merge(en, newStrings[lang] || {}, {
    ui: i18n[lang],
    campaigns: {
      bank: {
        petition: getPetition(lang, 'bank'),
        targets: addVariables(index(banks, bank => bank.ifsc))
      },
      gov: {
        petition: getPetition(lang, 'gov'),
        targets: addVariables(services)
      },
      mp: {
        petition: getPetition(lang, 'mp'),
        categories: cats
      },
      telcos: {
        petition: getPetition(lang, 'telcos'),
        targets: addVariables(index(telcos, telco => telco.code))
      },
      uidai: {
        petition: getPetition(lang, 'uidai')
      }
    }
  });
}

export const languages = Object.keys(i18n).map(code => ({ code, name: i18n[code].language_name }));

const enAll = getStrings('en');
// console.log(enAll);
export default enAll;


/*
{
  ui: {
    // User interface string keys and values
  },
  campaigns: {
    // Campaign code is "mp", "bank" etc.
    <campaign_code>: {
      // "Petition" describes the email being sent.
      petition: {
        // For campaigns which have just one "target" (e.g. UIDAI)
        // name, to and cc may be specified here.
        // Name may be specified as "Chairman and MD, ((service_name))"
        // Subject, body may also have field substitutions
        name, to, cc,
        subject, body, tweet
      },
      title: 'MP campaign',
      category_prompt: 'Select State', // For MP campaign only
      target_prompt: 'Select Constituency', // For MP, bank, telco, gov campaigns
      // Targets causes a dropdown to be displayed for this campaign.
      targets: {
        <target_code>: {
          name, to, cc, // For the email
          twitter,
          title, // optional, if different from name used in email
          // other fields for substitution, e.g.
        }
      }
      --- OR ---
      // Categories causes two dropdowns to be shown; use for State and Constituency
      categories: {
        <category_code>: {
          name,
          targets // This is the same as the "targets" above.
        }
      }
    }
  }
}
*/
