import Component from 'inferno-component';
import { languages } from '../strings';
import './LanguageSelect.css';

class LanguageSelect extends Component {
  onChange = event => {
    this.props.onChange && this.props.onChange(event.target.value);
  }

  render() {
    const { value } = this.props;
    return (
      <select className='LanguageSelect' onChange={this.onChange}>
        {languages.map(({ code, name }) => (
          <option value={code} selected={code === value}>{name}</option>
        ))}
      </select>
    );
  }
}

export default LanguageSelect;
