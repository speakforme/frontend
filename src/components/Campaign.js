import Component from 'inferno-component';
import EmailButton from './EmailButton';
import TargetSelect from './TargetSelect';
import './Campaign.css';

class Campaign extends Component {
  state = {}
  onTarget = (target) => {
    this.setState({ target });
  }
  render() {
    const {
      campaignId,
      petition,
      title,
      categories,
      targets,
      category_prompt,
      target_prompt
    } = this.props;
    const { target } = this.state;

    const targetRequired = !!(categories || targets);
    const targetSelected = !!target;

    // TODO: Add target's information to the petition object

    return (
      <div className="Campaign">
        <h2 className="Camapign-title">{title}</h2>
        {targetRequired && (
          <TargetSelect
            {...{ categories, targets, category_prompt, target_prompt }}
            onSelect={this.onTarget} />
        )}
        {(!targetRequired || targetSelected) && (
          <EmailButton {...petition} />
        )}
      </div>
    );
  }
}

export default Campaign;
