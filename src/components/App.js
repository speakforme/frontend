import Component from 'inferno-component';
import Logo from './Logo';
import Campaign from './Campaign';
import './App.css';

import strings from '../strings';

const {
  campaigns,
  ui: { title, headline, description, explanation }
} = strings;

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Logo height={48} width={48} />
          <div className="App-title">{title}</div>
        </header>
        <section className="App-intro">
          <h1>{headline}</h1>
          <p>{description}</p>
          <p>{explanation}</p>
        </section>
        {
          Object.keys(campaigns).map(campaignId => (
            <section className="App-campaign">
              <Campaign id={campaignId} {...campaigns[campaignId]} />
            </section>
          ))
        }
      </div>
    );
  }
}

export default App;
