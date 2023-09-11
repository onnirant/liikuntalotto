import React from 'react'

const ShowWinnerSport = (props) => {

    if (props.sport === undefined || props.sport.name === undefined) {
        //console.log("ShowWinnerSport saanut props.sport.name === undefined")
        return null
    } else {
        //console.log("ShowWinnerSport saanut props.sport.name === " + props.sport.name)
        let raatti = ""
        let indoor = ""

        if (props.sport.raatti) {
            raatti = "Raatti"
        } else {
            raatti = "Honkapirtti"
        }

        if (props.sport.indoor) {
            indoor = "Sisäliikunta"
        } else {
            indoor = "Ulkoliikunta"
        }
        return <div className="winner"><h2>{indoor} - {raatti}:</h2><h1>{props.sport.name}</h1></div>
    }
}
    

export default ShowWinnerSport