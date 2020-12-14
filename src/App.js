import './App.css';
import Combo from './components/Combo/Combo';
import Decklist from './components/Decklist/Decklist';
import Auto from './components/Decklist/Auto';
import Async from './components/Decklist/Async'
function App() {
  return (
    <div className="App">
      <Async />
      {/* <Decklist />
      <Combo /> */}
    </div>
  );
}

export default App;
