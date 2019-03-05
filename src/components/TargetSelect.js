import Component from 'inferno-component';
import './TargetSelect.css';

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

  componentDidMount = () => {
    if(this.props.targets && (Object.keys(this.props.targets).length === 1)) {
      const targetId = this.props.targets[Object.keys(this.props.targets)[0]].code;
      this.setState({
        selectedTarget: targetId,
      });
      this.props.onSelect(this.props.targets[targetId]);
    }
  }

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
                {targets[targetId].title || targets[targetId].name}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  }
}

export default TargetSelect;
