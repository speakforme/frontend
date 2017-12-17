import Component from 'inferno-component';
import './EmailButton.css';

const supportsLongUrls = (function() {
  var IEMobile = /IEMobile/i.test(navigator.userAgent);

  // TODO: check needs to be more robust
  // UCBrowser etc?
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(
      navigator.userAgent
    ) && !IEMobile
  );
})();

const supportsMailto = (function() {
  var IEMobile = /IEMobile/i.test(navigator.userAgent);

  // TODO: check needs to be more robust
  // UCBrowser etc?
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(
      navigator.userAgent
    ) && !IEMobile
  );
})();

class EmailButton extends Component {
  getMailUrl(type, includeBody) {
    let base, params;
    let {subject, body, name, to, cc, bcc} = this.props;

    // Windows chokes on long URLs, so we avoid them
    if(!includeBody) body = '';

    // Replace ((variables)) in the subject, name and body with values
    [subject, body, name] = [subject, body, name].map(
      str => (str || '').replace(/\(\((.*?)\)\)/g, (m, key) => this.props[key] || '')
    );

    // Yahoo cannot handle the "Name <email>" format
    const addrOnly = ['yahoo'].includes(type);

    // Encode recipient lists
    [to, cc, bcc] = [to, cc, bcc].map(emails => {
      if (!Array.isArray(emails)) emails = emails ? [emails] : [];
      if (!addrOnly && name) emails = emails.map(email => `${name}<${email}>`);
      return encodeURIComponent(emails.join(','));
    });

    // Encode the subject and body
    [subject, body] = [subject, body].map(encodeURIComponent);

    switch (type) {
      case 'gmail':
        base = `https://mail.google.com/mail/u/0/`;
        params = [
          `view=cm&fs=1&tf=1&source=mailto`,
          `to=${to}`,
          cc && `cc=${cc}`,
          bcc && `bcc=${bcc}`,
          subject && `su=${subject}`,
          body && `body=${body}`
        ];
      case 'yahoo':
        base = `http://compose.mail.yahoo.com/`;
        params = [
          `To=${to}`,
          cc && `Cc=${cc}`,
          bcc && `Bcc=${bcc}`,
          subject && `Subject=${subject}`,
          body && `Body=${body}`
        ];
      default:
        base = `mailto:${to}`;
        params = [
          cc && `cc=${cc}`,
          bcc && `bcc=${bcc}`,
          subject && `subject=${subject}`,
          body && `body=${body}`
        ];
    }

    return `${base}?${params.filter(p => p).join('&')}`;
  }

  render() {
    if (supportsMailto) {
      const url = this.getMailUrl('mailto', supportsLongUrls);
      return (
        <div className="EmailButton-group">
          <a className="EmailButton-view">View Petition</a>
          <a className="EmailButton" href={url} target="_blank">Send Email</a>
        </div>
      );
    } else {
      const gmail = this.getMailUrl('gmail', supportsLongUrls);
      const yahoo = this.getMailUrl('yahoo', supportsLongUrls);
      const other = this.getMailUrl('mailto', supportsLongUrls);
      return (
        <div className="EmailButton-group">
          <a className="EmailButton-view">View Petition</a>
          <a className="EmailButton btn-gmail" href={gmail} target="_blank">Gmail</a>
          <a className="EmailButton btn-yahoo" href={yahoo} target="_blank">Yahoo!</a>
          <a className="EmailButton btn-other" href={other} target="_blank">Other</a>
        </div>
      );
    }
  }
}

export default EmailButton;
