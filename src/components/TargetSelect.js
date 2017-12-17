import Component from 'inferno-component';
import './TargetSelect.css';

class TargetSelect extends Component {
  state = {}
  onCategory = event => {
    const categoryId = event.target.value;
    this.setState({
      targets: this.props.categories[categoryId].targets
    });
  }

  onTarget = event => {
    const targetId = event.target.value;
    const targets = this.state.targets || this.props.targets;
    this.props.onSelect(targets[targetId]);
  }

  render() {
    const {
      categories,
      category_prompt,
      target_prompt,
      onSelect
    } = this.props;
    const targets = this.state.targets || this.props.targets;

    return (
      <div className="TargetSelect-group">
        {categories && (
          <select className="TargetSelect" onChange={this.onCategory}>
            <option>{category_prompt}</option>
            {Object.keys(categories).map(categoryId => (
              <option value={categoryId}>{categories[categoryId].title}</option>
            ))}
          </select>
        )}
        {targets && (
          <select className="TargetSelect" onChange={this.onTarget}>
            <option>{target_prompt}</option>
            {Object.keys(targets).map(targetId => (
              <option value={targetId}>{targets[targetId].title}</option>
            ))}
          </select>
        )}
      </div>
    );
  }
}

export default TargetSelect;
