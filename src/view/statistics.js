import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import SmartView from "./smart.js";
import {StatisticPeriod} from "../const.js";
import {generateProfileRank, generateWatchedFilms} from "../utils/statistics.js";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
dayjs.extend(isBetween);

const getWatchedFilmsByPeriod = (watchedFilms, period) => {
  if (period === StatisticPeriod.ALL_TIME) {
    return watchedFilms;
  }
  return watchedFilms
    .slice()
    .filter((film) => dayjs(film.watchingDate).isBetween(dayjs(), dayjs().subtract(1, period)));
};

const getWatchedStatistic = (watchedFilmsByPeriod, watchedFilms) => {
  let watchingTime = 0;
  const genresStatistic = {};
  if (watchedFilmsByPeriod.length === 0) {
    return {
      watchingTime: 0,
      topGenre: ``,
      genresStatistic,
      userProfileRank: generateProfileRank(watchedFilmsByPeriod.length),
      watchedFilmCount: watchedFilmsByPeriod.length,
    };
  }

  for (let i = 0; i < watchedFilmsByPeriod.length; i++) {
    const film = watchedFilmsByPeriod[i];
    watchingTime += film.duration;
    film.genres.forEach((genre) => genresStatistic[genre] ? genresStatistic[genre]++ : (genresStatistic[genre] = 1));
  }

  const genres = Object.entries(genresStatistic).sort((a, b) => b[1] - a[1]);

  return {
    watchingTime,
    genres,
    topGenre: genres[0][0],
    userProfileRank: generateProfileRank(watchedFilms.length),
    watchedFilmCount: watchedFilmsByPeriod.length,
  };
};

const renderGenresChart = (genres, statisticCtx) => {
  let genresName;
  let genresNumber;

  if (!genres) {
    genresName = ``;
    genresNumber = 0;
  } else {
    genresName = genres.map((genre) => genre[0]);
    genresNumber = genres.map((genre) => genre[1]);
  }

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genresName,
      datasets: [{
        data: genresNumber,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const statisticFilterTemplate = (period, currentPeriod) => {
  return `<input type="radio"
   class="statistic__filters-input visually-hidden" name="statistic-filter"
   id="statistic-${period}" value="${period}"
    ${period === currentPeriod ? `checked` : ``}>
  <label for="statistic-${period}" class="statistic__filters-label">
  ${period === StatisticPeriod.ALL_TIME ? `All time` : `${period.charAt(0).toUpperCase() + period.slice(1)}`}</label>`;
};

const periodFiltersTemplate = (currentPeriod) => {
  return Object.values(StatisticPeriod)
    .map((period) => statisticFilterTemplate(period, currentPeriod)).join(``);
};

const createStatisticsTemplate = (data) => {
  const {films, statisticPeriod} = data;
  const watchedFilms = generateWatchedFilms(films);
  const watchedFilmsByPeriod = getWatchedFilmsByPeriod(watchedFilms, statisticPeriod);
  const watchedStatistic = getWatchedStatistic(watchedFilmsByPeriod, watchedFilms);
  const {watchingTime,
    topGenre,
    userProfileRank,
    watchedFilmCount,
  } = watchedStatistic;

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userProfileRank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${periodFiltersTemplate(statisticPeriod)}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilmCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${watchingTime === 0 ? `0 <span class="statistic__item-description">h</span>` : `${Math.trunc(watchingTime / 60)} <span class="statistic__item-description">h</span> ${watchingTime % 60} <span class="statistic__item-description">m</span>`}</p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class Stats extends SmartView {
  constructor(films) {
    super();
    this._data = {
      films,
      statisticPeriod: StatisticPeriod.ALL_TIME,
    };
    this._genresChart = null;
    this._periodChangeHandler = this._periodChangeHandler.bind(this);
    this._setInnersHandler();

    this._setChart();
  }

  getTemplate() {
    return createStatisticsTemplate(this._data);
  }

  _setInnersHandler() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, this._periodChangeHandler);
  }

  _periodChangeHandler(evt) {
    this.updateData({
      statisticPeriod: evt.target.value,
    });
  }

  restoreHandlers() {
    this._setInnersHandler();
    this._setChart();
  }

  _setChart() {
    const {films, statisticPeriod} = this._data;
    const statisticCtx = this.getElement().querySelector(`.statistic__chart`);
    const BAR_HEIGHT = 50;

    const watchedFilms = generateWatchedFilms(films);

    const watchedFilmsByPeriod = getWatchedFilmsByPeriod(watchedFilms, statisticPeriod);
    const watchedStatistic = getWatchedStatistic(watchedFilmsByPeriod, watchedFilms);
    const genres = watchedStatistic.genres;
    statisticCtx.height = BAR_HEIGHT * genres.length;
    this._genresChart = renderGenresChart(genres, statisticCtx);
  }
}
