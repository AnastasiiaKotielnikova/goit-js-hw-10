import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

refs = {
    countryInfo: document.queryCommandValue('.country-info'),
    countryList: document.querySelector('.country-list'),
    searchInput: document.querySelector('#search-box')
}

refs.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
    const getCountry = refs.searchInput.value.trim().toLowerCase();

    if(!getCountry) {
     clearInfo();
     clearList();
     return;
    
  }
    fetchCountries(getCountry)
        .then(renderCountries)
        .catch(newError);
}


function renderCountries(countries) {
    if (countries.length === 1) {
        clearList();
        const markup = countries.map(country => {
            return `<img src=${country.flags.svg} alt="" width="30"><span>${country.name.official}</span>
        <p>Capital: ${country.capital}</p>
        <p>Population: ${country.population}</p>
        <p>Languages: ${Object.values(country.languages)}</p>`
        })
            .join(``);
        refs.countryInfo.innerHTML = markup;
    }
    if(countries.length >= 2  && countries.length <= 10) {
      clearInfo();
      const markup = countries.map(country => {
        return `<li>
        <img src=${country.flags.svg} alt="" width="30"> <span>${country.name.official}</span></li>`
      })
            .join(``);
        refs.countryList.innerHTML = markup;
    }
    if (countries.length > 10) {
        clearInfo();
        clearList();
        return Notify.info(`Too many matches found. Please enter a more specific name.`);
    }
}

function newError() {
    clearList();
    clearInfo();
    Notify.failure("Oops, there is no country with that name");
}

function clearList() {
  refs.countryList.innerHTML = ``;
}
function clearInfo() {
  refs.countryInfo.innerHTML = ``;
}