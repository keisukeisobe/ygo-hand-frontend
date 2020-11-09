import React, {useState, useEffect} from "react";
import './Combo.css';

function Combo() {
  const [conditions, setConditions] = useState({});
  const [handsize, setHandsize] = useState(5);
  const [atLeast, setAtLeast] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    
  }

  const atLeastNumberDropdown = [];

  for (let i = 1; i <= handsize; i++){
    atLeastNumberDropdown.push(<option key={`at-least-${i}`} value={`${i}`}>{i}</option>)
  }

  const onSelect = (event) => {
    const target = event.target;
    const val = target.value;
    setAtLeast(val);
  }

  return (
    
    <form className="combo-form" onSubmit={handleSubmit}>
      <fieldset className="at-least-fieldset">
        <legend>At Least</legend>
        <label htmlFor="card-number-selector">
          At least <select name="at-least" id="card-number-selector" onChange={onSelect}>
            <option value="0">--</option>
            {atLeastNumberDropdown}
          </select> of:
        </label>
        <p>This combo needs at least {atLeast} cards from the below conditions:</p>
      </fieldset>

      <fieldset className="conditions">
        <legend>Conditions</legend>
        
      </fieldset>
    </form>
  )
}

export default Combo;