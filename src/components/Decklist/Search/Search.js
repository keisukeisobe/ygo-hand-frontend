import React from "react";
import Auto from '../Auto';

class Search extends React.Component {
  state = {
    value: '',
    searchResults: ['hello']
  }

  searchCard(search) {
    console.log('searching!');
    const url = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';
    const searchParam = encodeURI(search);
    fetch(`${url}?fname=${searchParam}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => {
        const data = responseJson.data.map(element => element.name);
        console.log(data);
        if (responseJson.length > 1){
          return responseJson;
        } else {
          return [{name: 'empty'}];
        }
      })
      .catch(err => {
      })
  }

  render() {
    return (
      <Auto />
    )
  }
}

export default Search;