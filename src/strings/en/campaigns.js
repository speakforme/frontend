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


export default {
  mp: {
    title: 'Ask your MP to help',
    category_prompt: 'Select State', // For MP campaign only
    target_prompt: 'Select Constituency', // For MP, bank, telco, gov campaigns
  },
  srikrishna: {
    title: 'Remind the data protection committee to protect your Aadhaar data.',
  },
  bank: {
    title: 'Tell the banks to stop threatening you.',
    target_prompt: 'Select Bank', // For MP, bank, telco, gov campaigns
  },
  telcos: {
    title: 'Ask telcos to stop spamming you.',
    target_prompt: 'Select Telco'
  },
  gov: {
    title: 'Ask public services: is this your job?',
    target_prompt: 'Select Service Provider'
  },
  uidai: {
    title: 'Tell the UIDAI to back off.'
  }
};
