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
    const url = supportsMailto && getMailUrl('mailto', this.props, supportsLongUrls);
    const { showModal, copied } = this.state;
    const { strings: { ui: { view_email, send_email } } } = this.context;

    return (
      <div className="EmailButton-group">
        <a // eslint-disable-line jsx-a11y/anchor-is-valid
          className="EmailButton-view"
          onClick={() => this.setState({ showModal: true })}
        >{view_email}</a>
        <a className="EmailButton"
          href={url || null} onClick={!url && this.showModal}
          target="_blank"
        >{send_email}</a>
        <EmailModal
          show={!!showModal}
          {...this.props}
          setTextArea={this.setTextArea}
          setOuter={this.setOuter}
          onClose={() => this.setState({ showModal: false })}
        ></EmailModal>
      </div>
    );
  }
}

export default EmailButton;
