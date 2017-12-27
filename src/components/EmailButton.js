import Component from 'inferno-component';
import EmailModal from './EmailModal';
import './EmailButton.css';

import {
  supportsMailto,
  supportsLongUrls,
  getMailUrl
} from '../lib/email';

class EmailButton extends Component {
  state = {};

  showModal = event => {
    let copied = false;
    if (!supportsLongUrls && this.el) {
      this.outer.style.display = 'flex';
      this.el.select();
      try { copied = document.execCommand('copy'); } catch (e) {}
      this.outer.style.display = '';
    }
    this.setState({ showModal: true, copied });
    event.preventDefault();
  }

  setTextArea = el => this.el = el;
  setOuter = outer => this.outer = outer;

  render() {
    const { disabled } = this.props;
    const url = !disabled && supportsMailto && getMailUrl('mailto', this.props, supportsLongUrls);
    const { showModal, copied } = this.state;
    const { view_email, send_email } = this.context.strings.ui;

    return (
      <div className="EmailButton-group">
        <button // eslint-disable-line jsx-a11y/anchor-is-valid
          className={`EmailButton-view ${disabled && 'EmailButton-view-disabled'}`}
          onClick={!disabled && (() => this.setState({ showModal: true }))}
        >{view_email}</button>
        <button // eslint-disable-line jsx-a11y/anchor-is-valid
          className={`EmailButton ${disabled && 'EmailButton-disabled'}`}
          href={url || null} onClick={!url && !disabled && this.showModal}
          target="_blank"
        >{send_email}</button>
        <EmailModal
          show={!!showModal}
          {...this.props}
          setTextArea={this.setTextArea}
          setOuter={this.setOuter}
          copied={copied}
          onClose={() => this.setState({ showModal: false })}
        ></EmailModal>
      </div>
    );
  }
}

export default EmailButton;
