/* eslint-disable no-undef */
import React from 'react'

const ChangeSettings = (props) => {

    if(props.admin) {
      //console.log(props)
    return(
    <form>
        <div>
          <h3>Arvonnan rajaus:</h3>
          <div><input type="radio" id="honkapirtti" name="raatti" value={false} checked={props.raattiSetting === false} onChange={props.handleSettingRaatti} />
            <label htmlFor="honkapirtti">Honkapirtti</label>
            <input type="radio" id="raatti" name="raatti" value={true} checked={props.raattiSetting === true} onChange={props.handleSettingRaatti} />
            <label htmlFor="raatti">Raatti</label>
          </div>
        </div>
        <div>
          <h3>Arvontatuloksen nollaus:</h3>
          <p>
            <button onClick={props.lotteryResetHandler}>Nollaa</button>
          </p>
        </div>
    </form>
    )
    }
    else {
      return null
    }
}

export default ChangeSettings