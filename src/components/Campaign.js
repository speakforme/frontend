import Component from 'inferno-component';
import EmailButton from './EmailButton';
import TargetSelect from './TargetSelect';
import './Campaign.css';

class Campaign extends Component {
  state = {}
  onTarget = (target) => {
    // The currently selected target.
    this.setState({ target });
  }
  render() {
    const {
      title,
      categories,
      targets,
      category_prompt,
      target_prompt
    } = this.props;
    const { target } = this.state;
    let { subject, body, name, ...rest } = { ...this.props.petition, ...target };

    // Replace ((variables)) in the subject, name and body with values
    [subject, body, name] = [subject, body, name].map(
      str => (str || '').replace(/\(\((.*?)\)\)/g, (m, key) => rest[key] || '')
    );

    const petition = { subject, body, name, ...rest };
    const targetRequired = !!(categories || targets);
    const targetSelected = !!target;

    return (
      <div className="Campaign">
        <h2 className="Camapign-title">{title}</h2>
        <div className="Campaign-form">
          <div>
            {targetRequired && (
              <TargetSelect
                {...{ categories, targets, category_prompt, target_prompt }}
                onSelect={this.onTarget} />
            )}
          </div>
          <div>
            {(!targetRequired || targetSelected) && (
              <EmailButton {...petition} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Campaign;
