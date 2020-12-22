import './App.css';
// import Combo from './components/Combo/Combo';
// import Decklist from './components/Decklist/Decklist';
import Async from './components/Decklist/Search'
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
