import React, {useState} from "react";
import './Decklist.css';

function Decklist() {
  const blankCardEntry = {
    name: '',
    copies: '',
  };

  const [decklist, setDecklist] = useState([
    {...blankCardEntry}
  ]);

  const addCardEntryRow = () => {
    setDecklist([...decklist, {...blankCardEntry}]);
  };

  const handleCardChange = (event) => {
    const updatedDecklist = [...decklist];
    updatedDecklist[event.target.dataset.index].name = event.target.value;
    setDecklist(updatedDecklist);
  }  
  
  const handleCopyChange = (event) => {
    const updatedDecklist = [...decklist];
    updatedDecklist[event.target.dataset.index].copies = event.target.value;
    setDecklist(updatedDecklist);
  }

  return (
    <>
      <div className="deckmaker-container">
        <form className="decklist-form" autoComplete="off">
          <legend>Decklist</legend>
          {
            decklist.map((value, index) => {
              const nameId = `name-${index}`;
              const copiesId = `copies-${index}`;
              return (
                <div className="cardname-copies-container" key={`row-${index}`}>
                  <div className="cardname-copies-column">
                    <label htmlFor={nameId}>Card Name: </label>
                    <input type="text" name={nameId} data-index={index} id={nameId} className="cardname" value={decklist[index].name} onChange={handleCardChange} />
                    <label htmlFor={copiesId}>Copies: </label>
                    <input type="number" name={copiesId} data-index={index} id={copiesId} className="copies" value={decklist[index].copies} onChange={handleCopyChange} min="1" max="3" />
                  </div>
                  <div className="add-button-column">  
                    {index === decklist.length - 1 && (decklist[index].copies >= 1 && decklist[index].copies <= 3) && decklist[index].name.length > 0 ?
                        <input className="add-card-button" type="button" value="Add Card" onClick={addCardEntryRow} /> :
                        <input className="add-button-column hidden" type="button" value="Add Card" />
                    }
                  </div>
                </div>
              );
            })
          }
        </form>
      </div>
      {
        decklist.map((value, index) => {
          let cardLine;
          if (value.copies >= 1 && value.copies <= 3){
            cardLine = <p key={`${value}-${index}`}>{value.name} {value.copies}</p>
          } else {
            cardLine = <></>
          }
          return (
            <div className="decklist-container" key={`cardLine-${value}=${index}`}>
              {cardLine}
            </div>
          );
        })
      }
    </>    
  )
}

export default Decklist;