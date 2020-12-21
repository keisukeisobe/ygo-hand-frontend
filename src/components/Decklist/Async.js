import fetch from 'cross-fetch';
import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

function Async() {
  //open or closed state, default closed
  const [open, setOpen] = useState(false);
  //options from which to load dropdown
  const [options, setOptions] = useState([]);
  //value of user input
  const [inputValue, setInputValue] = useState('');
  //WORK ON THE LOADING TOKEN: WHEN IS IT LOADING?
  let loading = open && options.length === 0;

  useEffect(() => {
    let active = true;
    //if there is no user input, reset the options to blank, do nothing
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
            } 
            else {
              return {data: [{name: "No such cards in database."}]};
            }
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
      style={{ width: 800 }}
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
          label="Asynchronous"
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

export default Async;