import Component from 'inferno-component';
import Logo from './Logo';
import Campaign from './Campaign';
import './App.css';

import campaigns from '../strings/campaigns';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Logo height={40} width={40} />
          <div className="App-title">Speak for me</div>
        </header>
        <section className="App-intro">
          <h1>Tired of the relentless Aadhaar drumbeat?</h1>
          <p>Make your voice heard. Tell the people forcing Aadhaar on you what you really think.</p>
          <p>These petitions will open in your mail app so you can read and edit them before sending.</p>
        </section>
        {
          campaigns.map(campaignId => (
            <section className="App-campaign">
              <Campaign id={campaignId} />
            </section>
          ))
        }
      </div>
    );
  }
}

export default App;
