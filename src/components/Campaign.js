import Component from 'inferno-component';
import EmailButton from './EmailButton';
import TargetSelect from './TargetSelect';
import './Campaign.css';

function replaceVariables(str, ctx) {
  return (str || '').replace(/\(\((.*?)\)\)/g, (m, key) => ctx[key] || '');
}

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
    const { campaign_completed, campaign_completed_target, send_again } = this.context.strings.ui;

    let { subject, body, name, ...rest } = { ...this.props.petition, ...target };
    subject = replaceVariables(subject, rest);
    body = replaceVariables(body, rest);
    name = replaceVariables(name, rest);

    const petition = { subject, body, name, ...rest };
    const targetRequired = !!(categories || targets);
    const targetSelected = !!target;
    const bcc = `${id}${target ? `-${target.code.toLowerCase()}` : ''}@email.speakforme.in`;

    return completed ? (
      <div className="Campaign-completed">
        <p className="Campaign-summary">
          {replaceVariables(
            completed === true ? campaign_completed : campaign_completed_target,
            completed
          )}: {title}{' '}
          <a // eslint-disable-line jsx-a11y/anchor-is-valid
            className="Campaign-redo"
            tabIndex={0}
            onClick={() => this.setState({ completed: false })}
          >{send_again}</a>
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
