import React from "react";
import Auto from '../Auto';

class Search extends React.Component {
  state = {
    value: '',
    searchResults: ['hello']
  }

  render() {
    return (
      <Auto />
    )
  }
}

export default Search;