import Component from 'inferno-component';
import './EmailModal.css';
import { supportsLongUrls, getMailUrl } from '../lib/email';
import strings from '../strings';

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
      show, copied, email, cc, bcc, subject,
      body, onClose, setTextArea, setOuter
    } = this.props;
    const gmail = getMailUrl('gmail', this.props, supportsLongUrls);
    const yahoo = getMailUrl('yahoo', this.props, supportsLongUrls);
    const other = getMailUrl('mailto', this.props, supportsLongUrls);

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
            <input readOnly value={email} />
          </label>
          <label className="EmailModal-field">
            <div className="EmailModal-label">Cc</div>
            <input readOnly value={cc} />
          </label>
          <label className="EmailModal-field">
            <div className="EmailModal-label">Bcc</div>
            <input readOnly value={bcc} />
          </label>
          <label className="EmailModal-field">
            <div className="EmailModal-label">Subject</div>
            <input readOnly value={subject} />
          </label>
          <textarea
            className='EmailModal-body'
            ref={setTextArea}
            value={body} readOnly />
          <div className="EmailButton-group">
            <a className="EmailButton btn-gmail" href={gmail} target="_blank">Gmail</a>
            <a className="EmailButton btn-yahoo" href={yahoo} target="_blank">Yahoo!</a>
            <a className="EmailButton btn-default" href={other} target="_blank">Other</a>
          </div>
        </div>
      </div>
    );
  }
}

export default EmailModal;
