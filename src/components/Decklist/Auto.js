import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

function Auto() {
  const [searchOptions, setSearchOptions] = useState([]);

  useEffect( () => {
    setSearchOptions(searchCard(''));
  }, [])

  const searchCard = (search) => {
    console.log('searching!');
    const url = 'c';
    const searchParam = encodeURI(search);
    fetch(`${url}?fname=${searchParam}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => {
        console.log(responseJson.data);
        if (responseJson.data.length > 1){
          return responseJson.data;
        } else {
          return [{name: 'empty'}];
        }
      })
      .catch(err => {
      })
  }

  return (
    <Autocomplete 
      id="cardname"
      options={searchOptions.map(element => element.name)}
      style={{width: 300}}
      renderInput={(params) => <TextField {...params} label="cardname" variant="outlined" />}
    />
  )
}

export default Auto;