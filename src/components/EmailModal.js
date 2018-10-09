import Component from 'inferno-component';
import './EmailModal.css';
import { supportsLongUrls, getMailUrl, getRecipients } from '../lib/email';

class EmailModal extends Component {
  render() {
    const {
      show, copied, email, cc, bcc, subject, name,
      body, onClose, onSend, setTextArea, setOuter
    } = this.props;
    const {
      send_gmail, send_yahoo, send_other,
      to_label, cc_label, bcc_label, subject_label,
      choose_msg, choose_paste_msg, choose_copy_paste_msg
    } = this.context.strings.ui;
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
            supportsLongUrls ? choose_msg :
            copied ? choose_paste_msg :
            choose_copy_paste_msg
          }</p>
          <label className="EmailModal-field">
            <div className="EmailModal-label">{to_label}</div>
            <input readOnly value={getRecipients(email, name)} />
          </label>
          <label className="EmailModal-field">
            <div className="EmailModal-label">{cc_label}</div>
            <input readOnly value={getRecipients(cc)} />
          </label>
          <label className="EmailModal-field">
            <div className="EmailModal-label">{bcc_label}</div>
            <input readOnly value={getRecipients(bcc)} />
          </label>
          <label className="EmailModal-field">
            <div className="EmailModal-label">{subject_label}</div>
            <input readOnly value={subject} />
          </label>
          <textarea
            className='EmailModal-body'
            ref={setTextArea}
            value={body} readOnly />
          <div className="EmailModal-buttongroup">
            <a
              className="EmailModal-button btn-gmail"
              href={gmailUrl}
              target="_blank"
              onClick={() => onSend('gmail')}
              tabIndex={0}
            >{send_gmail}</a>
            <a
              className="EmailModal-button btn-yahoo"
              href={yahooUrl}
              target="_blank"
              onClick={() => onSend('yahoo')}
              tabIndex={0}
            >{send_yahoo}</a>
            <a
              className="EmailModal-button btn-default"
              href={otherUrl}
              target="_blank"
              onClick={() => onSend('mailto')}
              tabIndex={0}
            >{send_other}</a>
          </div>
        </div>
      </div>
    );
  }
}

export default EmailModal;
