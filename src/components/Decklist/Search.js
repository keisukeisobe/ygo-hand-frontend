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
  //open or closed state, default closed
  const [open, setOpen] = useState(false);
  //options from which to load dropdown
  const [options, setOptions] = useState([]);
  //value of user input
  const [inputValue, setInputValue] = useState('');
  //the search is "loading" when the combobox is open, there are more than 3 characters in search input, and there is at least 1 dropdown option
  let loading = open && inputValue.length >= 3 && options.length < 1;

  useEffect(() => {
    let active = true;
    //if there is no user input, reset the options to blank, do nothing-- this is to prevent excessive API calls/load times/response size
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
          setOptions(cards.map(card => card.name));
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

  return (
    <Autocomplete
      id="search"
      style={{ width: 800, margin: 15}}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option === value}
      getOptionLabel={(option) => option}
      options={options}
      loading={loading}
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
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
  );
}

export default Search;