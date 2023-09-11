import React from 'react'

const Sport = (props) => {
  let raatti = ""
  let indoor = ""

  if (props.sport.raatti) {
    raatti = "Raatti"
  } else {
    raatti = "Honkapirtti"
  }

  if (props.sport.indoor) {
    indoor = "Sisä"
  } else {
    indoor = "Ulko"
  }

  return <li><button value={props.sport.id} onClick={() => props.deleteSport(props.sport)}>Poista</button> {props.sport.name} - {raatti} - {indoor} -  Arvontapaino: {props.sport.lastdone}</li>

}

const ShowSports = (props) => {
  if(props.sports !== undefined && props.admin) {
      return props.sports.map(sport => 
        <Sport key={sport.id} sport={sport} deleteSport={props.deleteSport} />
      )
  } else {
    return null
  }
}

  export default ShowSports