import Component from 'inferno-component';
import Logo from './Logo';
import Campaign from './Campaign';
// import LanguageSelect from './LanguageSelect';
import { getStrings } from '../strings';
import './App.css';

class App extends Component {
  state = { lang: 'en', strings: getStrings('en') }

  onLanguageChange = (lang) => {
    this.setState({ lang, strings: getStrings(lang) });
  }

  getChildContext() {
    return this.state;
  }

  render() {
    const {
      campaigns,
      ui: { title, headline, description, explanation, email_collection_note }
    } = this.state.strings;
    return (
      <div className="App">
        <header className="App-header">
          <Logo className="App-logo" />
          <div className="App-title">{title}</div>
          {/* <LanguageSelect value={this.state.lang} onChange={this.onLanguageChange}/> */}
        </header>
        <section className="App-intro">
          <h1>{headline}</h1>
          <p>{description}</p>
          <p>{explanation}</p>
        </section>
        {
          Object.keys(campaigns).map(campaignId => (
            <section className="App-campaign" key={campaignId}>
              <Campaign id={campaignId} {...campaigns[campaignId]} />
            </section>
          ))
        }
        <section className="App-notice">
          <p>{email_collection_note}</p>
        </section>
      </div>
    );
  }
}

export default App;
