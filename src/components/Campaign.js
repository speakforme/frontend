import Component from 'inferno-component';
import EmailButton from './EmailButton';
import TargetSelect from './TargetSelect';
import './Campaign.css';

class Campaign extends Component {
  state = {
    completed: JSON.parse(window.localStorage[`campaign-${this.props.id}-completed`] || 'false')
  }
  onTarget = (target) => {
    // The currently selected target.
    this.setState({ target });
  }
  onComplete = (method) => {
    window.localStorage[`campaign-${this.props.id}-completed`] = JSON.stringify(this.state.target || true);
    this.setState({ completed: this.state.target || true });
  }
  render() {
    const {
      id,
      title,
      categories,
      targets,
      category_prompt,
      target_prompt
    } = this.props;
    const { completed, target } = this.state;
    let { subject, body, name, ...rest } = { ...this.props.petition, ...target };

    // Replace ((variables)) in the subject, name and body with values
    [subject, body, name] = [subject, body, name].map(
      str => (str || '').replace(/\(\((.*?)\)\)/g, (m, key) => rest[key] || '')
    );

    const petition = { subject, body, name, ...rest };
    const targetRequired = !!(categories || targets);
    const targetSelected = !!target;
    const bcc = `${id}${target ? `-${target.code.toLowerCase()}` : ''}@email.speakforme.in`;

    return completed ? (
      <div className="Campaign-completed">
        <p className="Campaign-title">{title}</p>
        <p className="Campaign-summary">
          {completed.title || completed.name ?
            `Email sent to ${completed.title || completed.name}` :
            'Email sent'}{' '}
          <a onClick={() => this.setState({ completed: false })}>Send again</a>
        </p>
      </div>
    ) : (
      <div className="Campaign">
        <h2 className="Camapign-title">{title}</h2>
        <div className="Campaign-form">
          {targetRequired ? (
            <TargetSelect
              {...{ categories, targets, category_prompt, target_prompt }}
              onSelect={this.onTarget} />
          ) : <div className="Campaign-spacer"/>}
          <EmailButton
            {...petition}
            bcc={bcc}
            disabled={targetRequired && !targetSelected}
            onSend={this.onComplete}
          />
        </div>
      </div>
    );
  }
}

export default Campaign;
