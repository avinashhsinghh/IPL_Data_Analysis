/* eslint-disable no-undef */
fetch('../json_data/data.json').then(res => res.json()).then(json => {
  matchCountPlot(json['matchTotal'])
  winningCountPlot(json['winCount'])
  extrasCountPlot(json['extrasCount'])
  economicalBowlersPlot(json['economicalBowlers'])
})

// function for charting number of matches played in each season
function matchCountPlot (matchCountData) {
  let seasons = Object.keys(matchCountData)
  let matchData = formatData(seasons, matchCountData)
  // create the plot
  Highcharts.chart('matchCount', {
    chart: {
      type: 'column'
    },
    title: {
      text: 'IPL Seasons : Total Matches Played'
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      title: {
        text: 'Total Matches'
      }
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      series: {
        borderWidth: 0
      }
    },

    tooltip: {
      headerFormat: '<span style="font-size:13px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
    },

    'series': [
      {
        'name': 'Total Matches',
        'colorByPoint': true,
        'data': matchData
      }
    ]
  })
}

// function to plot number of wins for each team in all seasons
function winningCountPlot (winningData) {
  let teamNames = Object.keys(winningData)
  let seasons = ['2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017']
  let teamwins = teamNames.reduce((winCount, teamname) => {
    let seasonwins = Object.keys(winningData[teamname])
    if (winCount.hasOwnProperty(teamname)) {
      seasons.map(year => {
        if (seasonwins.includes(year)) {
          winCount[teamname].push(winningData[teamname][year])
        } else {
          winCount[teamname].push(0)
        }
      })
      return winCount
    } else {
      winCount[teamname] = []
      seasons.map(year => {
        if (seasonwins.includes(year)) {
          winCount[teamname].push(winningData[teamname][year])
        } else {
          winCount[teamname].push(0)
        }
      })
      return winCount
    }
  }, {})
  let winners = Object.keys(teamwins)
  let winCountData = winners.reduce((winCount, winner) => {
    var data = {}
    data['name'] = winner
    data['data'] = teamwins[winner]
    winCount.push(data)
    return winCount
  }, [])
  // HighChart code
  Highcharts.chart('winningCount', {
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Total Wins of Each Team'
    },
    xAxis: {
      categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017]
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Total Wins'
      }
    },
    legend: {
      reversed: true
    },
    plotOptions: {
      series: {
        stacking: 'normal'
      }
    },
    series: winCountData
  })
}

// function for plotting extra runs conceived by each team in 2016
function extrasCountPlot (extrasData) {
  let teamNames = Object.keys(extrasData)
  let extrasCountData = formatData(teamNames, extrasData)
  // Create the chart
  Highcharts.chart('extrasCount', {
    chart: {
      type: 'column'
    },
    title: {
      text: 'IPL Season 2016 : ExtraRuns Conceived'
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      title: {
        text: 'Total Extras'
      }
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      series: {
        borderWidth: 0
      }
    },

    tooltip: {
      headerFormat: '<span style="font-size:13px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
    },

    'series': [
      {
        'name': 'Total Extras',
        'colorByPoint': true,
        'data': extrasCountData
      }
    ]
  })
}

// function to find top economical bowlers in 2015
function economicalBowlersPlot (ecoBowlerData) {
  let bowlerEconomyData = Object.keys(ecoBowlerData)
  let topEconomicalBowlers = formatData(bowlerEconomyData, ecoBowlerData)
  // Create the chart
  Highcharts.chart('economicalBowlers', {
    chart: {
      type: 'column'
    },
    title: {
      text: 'IPL Season 2015 : Top Economical Bowlers'
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      title: {
        text: 'Economy'
      }
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      series: {
        borderWidth: 0
      }
    },

    tooltip: {
      headerFormat: '<span style="font-size:13px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
    },

    'series': [
      {
        'name': 'Top Economical Bowlers',
        'colorByPoint': true,
        'data': topEconomicalBowlers
      }
    ]
  })
}

// function to format data into column chart data format
function formatData (requiredData, givenData) {
  return requiredData.reduce((dataObjectArr, dataName) => {
    var dataObject = {}
    dataObject['name'] = dataName
    dataObject['y'] = givenData[dataName]
    dataObjectArr.push(dataObject)
    return dataObjectArr
  }, [])
}
