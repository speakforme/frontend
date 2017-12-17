import Component from 'inferno-component';
import EmailButton from './EmailButton';
import './Campaign.css';

class Campaign extends Component {
  render() {
    return (
      <div className="Campaign">
        <h2 className="Camapign-title">Campaign {this.props.id}</h2>
        <EmailButton />
      </div>
    );
  }
}

export default Campaign;
