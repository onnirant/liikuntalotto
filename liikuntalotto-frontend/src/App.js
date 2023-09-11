import React, { useState, useEffect } from 'react'
import ShowSports from './components/showSports'
import ShowWinnerSport from './components/showWinnerSport'
import AddSport from './components/addSport'
import settingsService from './services/settings'
import sportService from './services/sports'
import ChangeSettings from './components/changeSettings'

const App = () => {

  //Tilamuuttujat
  const [ raattiSetting, setRaattiSetting ] = useState(false)
  const [ sportdaySetting, setSportdaySetting ] = useState(2)
  const [ winnerSportIndoorId, setWinnerSportIndoorId ] = useState("")
  const [ winnerSportOutdoorId, setWinnerSportOutdoorId ] = useState("")
  const [ winnerSportDate, setWinnerSportDate ] = useState("")
  const [ sports, setSports ] = useState([])
  const [ winnerSportIndoor, setWinnerSportIndoor ] = useState([{name: ""}])
  const [ winnerSportOutdoor, setWinnerSportOutdoor ] = useState([{name: ""}])
  const [ disable, setDisable ] = useState(false)
  const [ admin, setAdmin ] = useState(false)
  const [ newSportName, setNewSportName ] = useState('')
  const [ newSportRaatti, setNewSportRaatti ] = useState(false)
  const [ newSportIndoor, setNewSportIndoor ] = useState(true)

  //Vakiot .env-tiedostosta
  const PWD = process.env.REACT_APP_LILO_PWD //Admin-salasana
  const LASTDONELIMIT = process.env.REACT_APP_LILO_LASTDONELIMIT //Raja-arvo arvonnalle, jotta samoja lajeja ei tulisi peräkkäin

  //Haetaan seuraava tiistai ja luodaan dd.mm.yyyy-String
  function getNextTuesday() {
    let dayOfWeek = sportdaySetting //2=Tiistai, 0=sunnuntai, 6=lauantai
    let date = new Date()
    date.setDate(date.getDate() + (dayOfWeek + 7 - date.getDay()) % 7)
    return date
  }
  const nextTuesday = getNextTuesday()
  const nextTuesdayMonth = nextTuesday.getMonth() + 1 //koska getMonth() palauttaa 0-11
  const tuesdayString = nextTuesday.getDate() + "." + nextTuesdayMonth + "." + nextTuesday.getFullYear()

  //Funktio JS:n typerien booleanien käpistelyn korjaamiseksi
  function str2bool(value) {
    if (value && typeof value === "string") {
         if (value.toLowerCase() === "true") return true;
         if (value.toLowerCase() === "false") return false;
    }
    return value;
  }

  //Haetaan asetukset MongoDB:stä
  useEffect(() => {
    settingsService
      .get()
        .then(fetchedsettings => {
          setRaattiSetting(fetchedsettings.raatti)
          setSportdaySetting(fetchedsettings.sportday)
          setWinnerSportIndoorId(fetchedsettings.winnersportindoorid)
          setWinnerSportOutdoorId(fetchedsettings.winnersportoutdoorid)
          setWinnerSportDate(fetchedsettings.winnersportdate)
        })
        .catch(error => {
          console.log("Error getting settings from DB")
        })
  }, [raattiSetting, winnerSportIndoorId, winnerSportOutdoorId, winnerSportDate])

  //Haetaan liikuntalajit MongoDB:stä
  useEffect(() => {
    sportService
      .getAll()
        .then(initialSports => {
          setSports(initialSports)
        })
        .catch(error => {
          console.log("Error getting initial data from DB")
          }
        )
  }, [])



  //Satunnaislukugeneraattori välille min-max
  function getRandom(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  //Tapahtumankäsittelijät arvonnan rajaukselle
  const handleSettingRaatti = (event) => {
    //console.log("handleSettingRaatti kutsuttu")
    
    const settingObject = {
      raatti: str2bool(event.target.value)
    }

    //console.log("raatti = " + settingObject.raatti)

    settingsService
      .update(settingObject)
        .then(returnedSettings => {
          //console.log("Succesfully set raatti setting")
      })
      .catch(error => {
        console.log("Error while changing Raatti/Honkapirtti setting")
        }
      )

      setRaattiSetting(str2bool(event.target.value))
  }

  //Tapahtumankäsittelijä arvonnan resetointinapille admin-puolelta
  const lotteryResetHandler = (event) => {

    //Nollaa aiemmin arvottu laji asetuksiin tietokantaan
    const settingObject = {
      winnersportoutdoorid: "",
      winnersportindoorid: "",
      winnersportdate: ""
    }

    settingsService
      .update(settingObject)
        .then(returnedSettings => {
          setWinnerSportIndoorId("")
          setWinnerSportOutdoorId("")
          setWinnerSportDate("")
      })
      .catch(error => {
        console.log("Error resetting lottery")
        }
      )
  }

  //Tapahtumankäsittelijät uuden lajin luonnille
  const handleNewSportName = (event) => {
    setNewSportName(event.target.value)
  }
  const handleNewSportRaatti = (event) => {
    //muuta string booleaniksi!
    setNewSportRaatti(str2bool(event.target.value))
  }
  const handleNewSportIndoor = (event) => {
    //muuta string booleaniksi!
    setNewSportIndoor(str2bool(event.target.value))
  }

  //Tapahtumakäsittelijä admin-napille
  const adminView = (event) => {
    if(!admin) {
      let password = prompt("Anna salasana:")
      if(password === PWD) {
        setAdmin(true)
      }
    } else {
      setAdmin(false)
    }
  }

  //Uuden lajin lisäys
  const addSport = (event) => {
    event.preventDefault()
    const sportObject = {
      name: newSportName,
      raatti: newSportRaatti,
      indoor: newSportIndoor,
      lastdone: 0 //Uudet lajit alustetaan aina nollaksi
    }

    sportService
      .create(sportObject)
        .then(returnedSport => {
          setSports(sports.concat(returnedSport))
          setNewSportName('')
      })
      .catch(error => {
        console.log("Error creating new sport")
        }
      )
  }

  //Lajin poisto
  const deleteSport = deletedSport =>  {
      sportService
      .remove(deletedSport.id)
        .then(() => {
          setSports(sports.filter(sport => sport.id !== deletedSport.id))
        })
        .catch(error => {
          console.log("Error deleting sport")
          }
        )
  }

  //Liikuntalajin arvonta
  const lottery = (event) => {
    //console.log("Arvonta aloitettu")
    //lukitse arvontanappi
    setDisable(true)

    let iteratedSports = sports

    //Vähennä kaikkien lastdonea 1:llä, JOS lastdone >0
    iteratedSports.forEach(iteratableSport => {
      if(iteratableSport.lastdone > 0) {
        //console.log("lastdone--")
        iteratableSport.lastdone--
      }
    })

    //Päivitetään sports-taulukon tila
    setSports(iteratedSports)

    //Päivitetään sports-taulukko myös tietokantaan
    iteratedSports.forEach(iteratableSport => {
      sportService
      .update(iteratableSport.id, iteratableSport)
      .catch(error => {
        console.log("Error while updating lastdone for sport id " + iteratableSport.id)
        }
      )
    })
    
    //Suoritetaan arvonta sisä- ja ulkolajille. Käytetään iteraattoria ilmaisemaan arvotaanko sisälajia vai ulkolajia (indoor == 0 tai 1)
    for(let i = 0; i <= 1; i++) {
      //console.log("Arvonnan for-loopin alku")
      let isIndoor
      if(i === 0) {
        isIndoor = true
      } else {
        isIndoor = false
      }

      //Arvotaan niistä, joiden lastdone == 0 JA paikka on asetusten mukainen (haettu alussa MongoDB:stä)
      let acceptableSports = sports.filter(sport => sport.lastdone === 0 && sport.raatti === raattiSetting && sport.indoor === isIndoor)
      
      //Jos hyväksyttäviä lajeja on liian vähän, löysätään ehtoa lastdone-arvon osalta, tässä tapauksessa hyväksytään lastdone-arvo joka on pienempi kuin asetettu limit
      if(acceptableSports.length === 0) {
        acceptableSports = sports.filter(sport => sport.lastdone < LASTDONELIMIT && sport.raatti === raattiSetting && sport.indoor === isIndoor)
      }
      
      let max = acceptableSports.length - 1
      let random = getRandom(0, max)
      let randomizedSport = acceptableSports[random]

      //console.log("Arvottiin lajiksi " + randomizedSport.name)

      //Aseta voittajan lastdone-arvo ympäristömuuttujan mukaan
      randomizedSport.lastdone = LASTDONELIMIT

      //Päivitä voittajan lastdone-muutos kantaan
      sportService
      .update(randomizedSport.id, randomizedSport)
      .then(returnedSport => {
        //console.log("Muutettiin voittajan lastdone")
        setSports(sports.map(sport => sport.id !== randomizedSport.id ? sport : returnedSport))
      })
      .catch(error => {
        console.log("Error while updating lottery winner")
        }
      )
      
      var settingObject = {}

      if(isIndoor) {
        settingObject = {
          winnersportdate: tuesdayString,
          winnersportindoorid: randomizedSport.id
        }
      } else {
        settingObject = {
          winnersportdate: tuesdayString,
          winnersportoutdoorid: randomizedSport.id
        }
      }

      //console.log(settingObject)

      settingsService
        .update(settingObject)
          .then(returnedSettings => {
            //console.log("Arvontavoittajan tallennus tietokantaan success")
            setWinnerSportDate(returnedSettings.winnersportdate)
            if(isIndoor) {
              //console.log("Asetetaan sisäliikunnan voittaja tilamuuttujiin")
              setWinnerSportIndoor(randomizedSport)
              setWinnerSportIndoorId(randomizedSport.id)
            } else {
              //console.log("Asetetaan ulkoliikunnan voittaja tilamuuttujiin")
              setWinnerSportOutdoor(randomizedSport)
              setWinnerSportOutdoorId(randomizedSport.id)
            }
        })
        .catch(error => {
          console.log("Error updating winner sport")
          }
        )

    } //for, suoritetaan 2 kertaa
    
  

}


  //Onko laji jo arvottu? Jos on, piilotetaan arvontanappi ja näytetään sen sijaan voittaja ja päivämäärä
  
  useEffect(() => {
    //Tarkistetaan sports.length, tällä varmistetaan että liikuntalajit on varmasti haettu ennen kun aletaan tekemään mitään
    if(sports.length !== 0 && winnerSportDate === tuesdayString) {
      //lukitse arvontanappi
      setDisable(true)
  
      let filteredIndoorSports = sports.filter(si => si.id === winnerSportIndoorId)
      let filteredOutdoorSports = sports.filter(so => so.id === winnerSportOutdoorId)
  
      setWinnerSportIndoor(filteredIndoorSports[0])
      setWinnerSportOutdoor(filteredOutdoorSports[0])
    }
  }, [sports, tuesdayString, winnerSportDate, winnerSportOutdoorId, winnerSportIndoorId]); 
  
  return (
    <div>
      <div className="admin">
        <button className="admintoggle" onClick={adminView}>Admin</button>
        <ChangeSettings
          admin={admin}
          handleSettingRaatti={handleSettingRaatti}
          raattiSetting={raattiSetting}
          lotteryResetHandler={lotteryResetHandler}
        />
        <AddSport
          admin={admin}
          addSport={addSport}
          newSportName={newSportName}
          newSportRaatti={newSportRaatti}
          newSportIndoor={newSportIndoor}
          handleNewSportName={handleNewSportName}
          handleNewSportRaatti={handleNewSportRaatti}
          handleNewSportIndoor={handleNewSportIndoor}
        />
        <ul>
          <ShowSports admin={admin} sports={sports} deleteSport={deleteSport} />
        </ul>
      </div>
      <div className="mainview">
        <h1>Seuraavan liikuntapäivän {tuesdayString} lajit ovat:</h1>
        <ShowWinnerSport sport={winnerSportIndoor} />
        <ShowWinnerSport sport={winnerSportOutdoor} />
        <button className="lottery" style={{ display: disable ? "none" : "inline" }} disabled={disable} onClick={lottery}>Arvo laji</button>
      </div>
    </div>
  )

}

export default App
