import { render } from 'inferno';
import './registerServiceWorker';
import App from './components/App';
import './index.css';

render(<App />, document.getElementById('app'));
