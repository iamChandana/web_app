import moment from 'moment';

// massage data. Contribute by Benjamin Wong
export const convertGraphDataForPloting = (graphData) => {
  if (!graphData || graphData.length < 1) {
    return [];
  }

  const dates = _
    .chain(graphData)
    .cloneDeep()
    .flatten()
    .map((x) => x.fundGraph)
    .flatten()
    .map((x) => x.date)
    .uniq()
    .map((x) => ({
      date: x,
    }))
    .groupBy((x) => x.date)
    .value();

  const grouped = _
    .chain(graphData)
    .cloneDeep()
    .groupBy((x) => x.isin)
    .value();

  const keys = Object.keys(grouped);

  keys.forEach((x) => {
    const target = grouped[x][0];
    const {
      fundGraph,
    } = target;
    fundGraph.forEach((y) => {
      dates[y.date][0][x] = y.value;
    });
  });

  const dateKeys = Object.keys(dates);
  const rawResults = [];
  dateKeys.forEach((x) => rawResults.push(dates[x]));

  return _.flatten(rawResults);
};

export const generateXAxisLabel = (graphData, numOfYear) => {
    // get ticks for x axis. need to loop thru every record as we do not know
    // which date is present since some date are holiday or weekend
  const ticks = [];

  if (numOfYear < 1 || !graphData || graphData.length < 1) {
    return ticks;
  }

  for (const obj of graphData) {
    const month = Number(moment(obj.date).format('M'));
    let divider = 0;
    if (numOfYear < 3) {
      divider = 2;
    } else if (numOfYear === 3) {
      divider = 4;
    } else if (numOfYear > 3 && numOfYear <= 5) {
      divider = 5;
    } else if (numOfYear > 5) {
      divider = 7;
    }
    if (month % divider === 0) {
      let foundSameYearMonth = false;
      for (const stringDate of ticks) {
        const d1 = moment(stringDate).format('YYYY-MM');
        const d2 = moment(obj.date).format('YYYY-MM');
        if (d1 === d2) {
          foundSameYearMonth = true;
          break;
        }
      }
      if (!foundSameYearMonth) {
        ticks.push(obj.date);
      }
    }
  }

  return ticks;
};

