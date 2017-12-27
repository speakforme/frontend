import Component from 'inferno-component';
import './EmailModal.css';
import { supportsLongUrls, getMailUrl, getRecipients } from '../lib/email';

class EmailModal extends Component {
  state = {}

  componentDidMount() {
    // let copied = false;
    // this.el.select();
    // try { copied = document.execCommand('copy'); } catch (e) {}
    // this.setState({ copied });
  }

  render() {
    const {
      show, copied, email, cc, bcc, subject, name,
      body, onClose, setTextArea, setOuter
    } = this.props;
    const { send_gmail, send_yahoo, send_other } = this.context.strings.ui;
    const gmailUrl = getMailUrl('gmail', this.props, supportsLongUrls);
    const yahooUrl = getMailUrl('yahoo', this.props, supportsLongUrls);
    const otherUrl = getMailUrl('mailto', this.props, supportsLongUrls);

    return (
      <div className={`EmailModal-outer ${show ? 'EmailModal-outer-shown' : ''}`}
        onClick={onClose}
        ref={setOuter}
      >
        <div className="EmailModal" onClick={e => e.stopPropagation()}>
          <button className="EmailModal-close" onClick={onClose}>×</button>
          <p>{
            supportsLongUrls ? 'Choose your email app below. The petition will be filled automatically.' :
            copied ? 'The petition has been copied. Choose your email app below and paste it in.' :
            'Copy the petition below and choose your email app to paste in. The address will be filled automatically.'
          }</p>
          <label className="EmailModal-field">
            <div className="EmailModal-label">To</div>
            <input readOnly value={getRecipients(email, name)} />
          </label>
          <label className="EmailModal-field">
            <div className="EmailModal-label">Cc</div>
            <input readOnly value={getRecipients(cc)} />
          </label>
          <label className="EmailModal-field">
            <div className="EmailModal-label">Bcc</div>
            <input readOnly value={getRecipients(bcc)} />
          </label>
          <label className="EmailModal-field">
            <div className="EmailModal-label">Subject</div>
            <input readOnly value={subject} />
          </label>
          <textarea
            className='EmailModal-body'
            ref={setTextArea}
            value={body} readOnly />
          <div className="EmailModal-buttongroup">
            <a className="EmailModal-button btn-gmail" href={gmailUrl} target="_blank">{send_gmail}</a>
            <a className="EmailModal-button btn-yahoo" href={yahooUrl} target="_blank">{send_yahoo}</a>
            <a className="EmailModal-button btn-default" href={otherUrl} target="_blank">{send_other}</a>
          </div>
        </div>
      </div>
    );
  }
}

export default EmailModal;
