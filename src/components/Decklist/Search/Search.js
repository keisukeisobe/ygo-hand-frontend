import React from "react";
import Autocomplete from "react-autocomplete";

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
        // const data = responseJson.data.map(element => element.name);
        // console.log(data);
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
      <Autocomplete 
        items={this.state.searchResults}
        value={this.state.value}
        getItemValue={item => item.name}
        onChange={(event, value) => {
          this.setState({value})
          let results = setTimeout(this.searchCard(event.target.value), 1000);
          this.setState({searchResults: results})
        }}
        onSelect={(value, item) => {
          this.setState({ value, searchResults: [ item ] })
        }}
        renderMenu={children => (
          <div className="menu">
            {children}
          </div>
        )}
        renderItem={(item, isHighlighted) => (
          <div
            className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
            key={item}
          >{item.name}</div>
        )}
        className="cardname"
      />
    )
  }
}


export default Search;