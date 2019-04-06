//convert csv datasets to JSON
const csv = require('./csv_to_json.js')
let matchData = csv.convertmyfile('../datasets/matches.csv')
let deliveryData = csv.convertmyfile('../datasets/deliveries.csv')
const fs = require('fs')

// get total number of matches played in each season
function matchesTotal () {
  return matchData.reduce((matchesInSeason, match) => {
    if (matchesInSeason.hasOwnProperty(match['season'])) {
      matchesInSeason[match['season']] += 1
      return matchesInSeason
    } else {
      matchesInSeason[match['season']] = 1
      return matchesInSeason
    }
  }, {})
}

// find total number of wins for each team in each season
function winningCount () {
  return matchData.reduce((winsInSeason, match) => {
    if (winsInSeason.hasOwnProperty(match['winner'])) {
      if (winsInSeason[match['winner']].hasOwnProperty(match['season'])) {
        winsInSeason[match['winner']][match['season']] += 1
      } else {
        if (match['winner'] !== '') {
          winsInSeason[match['winner']][match['season']] = 1
        }
      }
      return winsInSeason
    } else {
      if (match['winner'] !== '') {
        winsInSeason[match['winner']] = {}
        winsInSeason[match['winner']][match['season']] = 1
      }
      return winsInSeason
    }
  }, {})
}

// obtain extras conceived by each team in 2016
function extras () {
  return getDeliveries(2016).reduce((extrasPerTeam, delivary) => {
    if (extrasPerTeam.hasOwnProperty(delivary['bowling_team'])) {
      extrasPerTeam[delivary['bowling_team']] += delivary['extra_runs']
    } else {
      extrasPerTeam[delivary['bowling_team']] = delivary['extra_runs']
    }
    return extrasPerTeam
  }, {})
}

// getting top economical bowlers in 2015
function economicBowlers () {
  let bowlerObj = getDeliveries(2015).reduce((bowlerStats, deliveries) => {
    if (bowlerStats.hasOwnProperty(deliveries['bowler'])) {
      bowlerStats[deliveries['bowler']]['runs'] += deliveries['total_runs']
      if (deliveries['ball'] === 1) {
        bowlerStats[deliveries['bowler']]['overs'] += 1
      }
      return bowlerStats
    } else {
      bowlerStats[deliveries['bowler']] = {}
      bowlerStats[deliveries['bowler']]['runs'] = deliveries['total_runs']
      bowlerStats[deliveries['bowler']]['overs'] = 1
      return bowlerStats
    }
  }, {})
  let bowlerArr = Object.keys(bowlerObj)
  let ecoBowlersObj = bowlerArr.reduce((bowlerName, bowlerEconomy) => {
    bowlerName[Math.round((bowlerObj[bowlerEconomy]['runs'] / bowlerObj[bowlerEconomy]['overs']) * 100) / 100] = bowlerEconomy
    return bowlerName
  }, {})
  let ecoBowlersArr = Object.keys(ecoBowlersObj)
  return ecoBowlersArr.map(economy => parseFloat(economy)).sort((a, b) => a - b).slice(0, 20).reduce((bowlerEconomy, economy) => {
    bowlerEconomy[ecoBowlersObj[economy]] = economy
    return bowlerEconomy
  }, {})
}

// function to get deliveries of required matchIDs
function getDeliveries (season) {
  let matchIds = matchData.reduce((matchId, match) => {
    if (match['season'] === season) {
      matchId.push(match['id'])
    }
    return matchId
  }, [])
  return deliveryData.filter(deliveries => {
    if (matchIds.includes(deliveries['match_id'])) {
      return deliveries
    }
  })
}

// converting data into json file
function convertToJson () {
  let completeQueriesData = {}
  completeQueriesData['matchTotal'] = matchesTotal()
  completeQueriesData['winCount'] = winningCount()
  completeQueriesData['extrasCount'] = extras()
  completeQueriesData['economicalBowlers'] = economicBowlers()

  fs.writeFileSync('../json_data/data.json', JSON.stringify(completeQueriesData, null, 2))
}

convertToJson()
