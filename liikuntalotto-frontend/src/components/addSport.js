/* eslint-disable no-undef */
import React from 'react'

const AddSport = (props) => {
    if(props.admin) {
    return(
    <form onSubmit={props.addSport}>
        <div>
          <h3>Lisää uusi laji:</h3>
          <div>Lajin nimi: <input value={props.newSportName} onChange={props.handleNewSportName} /></div>
          <div><input type="radio" id="honkapirtti" name="raatti" value={false} checked={!props.newSportRaatti} onChange={props.handleNewSportRaatti} />
            <label htmlFor="honkapirtti">Honkapirtti</label>
            <input type="radio" id="raatti" name="raatti" value={true} checked={props.newSportRaatti} onChange={props.handleNewSportRaatti} />
            <label htmlFor="raatti">Raatti</label>
          </div>
          <div><input type="radio" id="sisa" name="indoor" value={true} checked={props.newSportIndoor} onChange={props.handleNewSportIndoor} />
            <label htmlFor="sisa">Sisä</label>
            <input type="radio" id="ulko" name="indoor" value={false} checked={!props.newSportIndoor} onChange={props.handleNewSportIndoor} />
            <label htmlFor="ulko">Ulko</label>
          </div>
          <div>
            <button type="submit">Lisää</button>
          </div>
        </div>
      </form>
    )
    }
    else {
      return null
    }
}

export default AddSport