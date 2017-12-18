import Component from 'inferno-component';
import './EmailModal.css';

class EmailModal extends Component {
  render() {
    const { show, to, cc, bcc, subject, body, onClose } = this.props;
    return (
      <div
        className={`EmailModal-outer ${show ? 'EmailModal-outer-shown' : ''}`}
        onClick={onClose}
      >
        <div className="EmailModal" onClick={e => e.stopPropagation()}>
          <button className="EmailModal-close" onClick={onClose}>×</button>
          <p>Here's our sample email, if you need to refer to it.</p>
          <label className="EmailModal-field">
            <div className="EmailModal-label">To</div>
            <input readOnly value={to} />
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
          <textarea readOnly className='EmailModal-body' value={body}></textarea>
        </div>
      </div>
    );
  }
}

export default EmailModal;
