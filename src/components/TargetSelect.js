import Component from 'inferno-component';
import './TargetSelect.css';

import states from '../strings/data/states.json';

states['NOM'] = 'Nominated';

const getTargetDisplay = (target, target_prompt) => {
  if (target_prompt !== 'Find Your Representative') {
    return target.title || target.name;
  } else {
    const statePrefix = states[target.state]
      ? states[target.state] + ' - '
      : '';
    const partySuffix = target.party ? ` (${target.party})` : '';
    return statePrefix + target.name + partySuffix;
  }
};

class TargetSelect extends Component {
  state = {};
  onCategory = event => {
    const categoryId = event.target.value;
    this.setState({
      selectedCategory: categoryId,
      targets: this.props.categories[categoryId].targets,
    });
  };

  onTarget = event => {
    const targetId = event.target.value;
    const targets = this.state.targets || this.props.targets;
    this.setState({
      selectedTarget: targetId,
    });
    this.props.onSelect(targets[targetId]);
  };

  render() {
    const { categories, category_prompt, target_prompt } = this.props;
    const { selectedCategory, selectedTarget } = this.state;
    const targets = this.state.targets || this.props.targets;

    return (
      <div className="TargetSelect-group">
        {categories && (
          <select className="TargetSelect" onChange={this.onCategory}>
            <option>{category_prompt}</option>
            {Object.keys(categories).map(categoryId => (
              <option
                selected={selectedCategory === categoryId}
                value={categoryId}
              >
                {categories[categoryId].title || categories[categoryId].name}
              </option>
            ))}
          </select>
        )}
        {targets && (
          <select className="TargetSelect" onChange={this.onTarget}>
            <option>{target_prompt}</option>
            {Object.keys(targets).map(targetId => (
              <option selected={selectedTarget === targetId} value={targetId}>
                {getTargetDisplay(targets[targetId], target_prompt)}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  }
}

export default TargetSelect;
