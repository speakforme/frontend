export const supportsLongUrls = (function() {
  var IEMobile = /IEMobile/i.test(navigator.userAgent);

  // TODO: check needs to be more robust
  // UCBrowser etc?
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(
      navigator.userAgent
    ) && !IEMobile
  );
})();

export const supportsMailto = (function() {
  var IEMobile = /IEMobile/i.test(navigator.userAgent);

  // TODO: check needs to be more robust
  // UCBrowser etc?
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(
      navigator.userAgent
    ) && !IEMobile
  );
})();

export function getRecipients(emails, name, addrOnly) {
  if (!Array.isArray(emails)) emails = emails ? emails.split(/,\s*/g) : [];
  if (name) emails = emails.map(email => `${name}<${email}>`);
  return emails.join(',');
}

export function getMailUrl(type, {subject, body, name, email, cc, bcc}, includeBody) {
  let base, params;

  // Windows chokes on long URLs, so we avoid them
  if(!includeBody) body = '';

  // Yahoo cannot handle the "Name <email>" format
  const addrOnly = ['yahoo'].includes(type);

  // Encode recipient lists
  email = encodeURIComponent(getRecipients(email, !addrOnly && name));
  cc = encodeURIComponent(getRecipients(cc));
  bcc = encodeURIComponent(getRecipients(bcc));

  // Encode the subject and body
  [subject, body] = [subject, body].map(encodeURIComponent);

  switch (type) {
    case 'gmail':
      base = `https://mail.google.com/mail/u/0/`;
      params = [
        `view=cm&fs=1&tf=1&source=mailto`,
        `to=${email}`,
        cc && `cc=${cc}`,
        bcc && `bcc=${bcc}`,
        subject && `su=${subject}`,
        body && `body=${body}`
      ];
      break;
    case 'yahoo':
    // http://compose.mail.yahoo.com/?to=TO&subject=SUBJECTMap&body=BODY
      base = `http://compose.mail.yahoo.com/`;
      params = [
        `to=${email}`,
        cc && `cc=${cc}`,
        bcc && `bcc=${bcc}`,
        subject && `subject=${subject}`,
        body && `body=${body}`
      ];
      break;
    default:
      base = `mailto:${email}`;
      params = [
        cc && `cc=${cc}`,
        bcc && `bcc=${bcc}`,
        subject && `subject=${subject}`,
        body && `body=${body}`
      ];
      break;
  }

  return `${base}?${params.filter(p => p).join('&')}`;
}
