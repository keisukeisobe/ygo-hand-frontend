import fetch from 'cross-fetch';
import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import './Search.css';

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

function Search() {
  const [decklist, setDecklist] = useState([]);
  const [mainDecklist, setMainDecklist] = useState([]);
  const [extraDecklist, setExtraDecklist] = useState([]);
  const [copies, setCopies] = useState(1);
  //open or closed state, default closed
  const [open, setOpen] = useState(false);
  //options from which to load dropdown
  const [options, setOptions] = useState([]);
  //value of user input
  const [inputValue, setInputValue] = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  //the search is "loading" when the combobox is open, there are more than 3 characters in search input, and there is at least 1 dropdown option
  let loading = open && inputValue.length >= 3 && options.length < 1;

  useEffect(() => {
    let active = true;
    //if user input is short, reset the options to blank, do nothing-- this is to prevent excessive API calls/load times/response size
    if(inputValue.length < 3) {
      setOptions([]);
    }
    //if loading, do nothing
    if (!loading) {
      return undefined;
    }
    //if user input is longer than 3 characters-- this is so we do not exceed maximum call stack due to result size
    if (inputValue.length >= 3){
      (async () => {
        const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${inputValue}`)
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              return {data: [{name: "No such cards in database."}]};
            }
          })
          .catch(error => {
            console.log(error);
          })
        await sleep(1e2); // For timeout purposes.
        let cards = await response;
        cards = cards.data; 
        if (active && cards !== undefined) {
          console.log(cards);
          setOptions(cards);
          //setOptions(cards.map(card => card.name));
        } else {
          setOptions([]);
        }
      })();      
    }
    //when done, deactivate: only rerender on changes to loading or inputValue
    return () => {
      active = false;
    };
  }, [loading, inputValue]);

  //if box is not active/open, set options to blank array
  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const addCard = (event) => {
    event.preventDefault();    
    //const updatedDecklist = [...decklist];
    //updatedDecklist.push({name: inputValue, copies: copies});
    console.log(selectedCard[0].type);
    const extraDeckCardTypes = ["Fusion Monster", "Link Monster", "Pendulum Effect Fusion Monster", "Synchro Monster", "Synchro Pendulum Effect Monster", "Synchro Tuner Monster", "XYZ Monster", "XYZ Pendulum Effect Monster"];
    if (extraDeckCardTypes.includes(selectedCard[0].type)){
      const updatedExtraDecklist = [...extraDecklist];
      updatedExtraDecklist.push({name: inputValue, copies: copies});
      setExtraDecklist(updatedExtraDecklist);
    } else {
      const updatedMainDecklist = [...mainDecklist];
      updatedMainDecklist.push({name: inputValue, copies: copies});
      setMainDecklist(updatedMainDecklist);
    }
    setCopies(1);
    setInputValue("");
    //setDecklist(updatedDecklist);
  }

  const handleCopyChange = (event) => {
    setCopies(event.target.value);
  }

  return (
    <>
      <form>
        <div className="flex-outer">
          <Autocomplete
            id="search"
            style={{ width: 600, margin: '15px 5px'}}
            open={open}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            value={inputValue}
            getOptionSelected={(option, value) => option === value}
            getOptionLabel={(option) => option}
            options={options.map(card => card.name)}
            loading={loading}
            onChange={(event, newValue) => {
              setSelectedCard(options.filter(card => card.name===newValue));
              setOptions(newValue ? [newValue, ...options] : options);
            }}
            onInputChange={(event, newValue) => {
              setInputValue(newValue);
            }}

            renderInput={(params) => (
              <TextField
                {...params}
                label="Search A Card"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
            <input type="number" className="add-copies-input" name={inputValue} id={inputValue} value={copies} onChange={handleCopyChange} min={1} max={3}/>
            <button className="add-copies-btn" onClick={addCard}>
              Add
            </button>
        </div>            
      </form>
      <h2>Decklist</h2>
      <h3>Main Deck</h3>
      <ul className="ul-decklist">
        {mainDecklist.map((element, index) => <li className="li-decklist" key={`${element.name}-${index}`}>{element.copies} {element.name}</li>)}
      </ul>
      <h3>Extra Deck</h3>
      <ul className="ul-decklist">
        {extraDecklist.map((element, index) => <li className="li-decklist" key={`${element.name}-${index}`}>{element.copies} {element.name}</li>)}
      </ul>
    </>
  );
}

export default Search;