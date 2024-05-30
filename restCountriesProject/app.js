let setTheme = true;
const regionsDisplay = document.querySelector("#filterByRegion");
const body = document.querySelector("body");
const displayAllCountries = document.querySelector("#countriesDisplay");
const countryDsiplay = document.querySelector("#country-display");
const allCountries = document.querySelectorAll(".eachCountry");
const filterByRegion = document.querySelector("#filterByRegion");
const searchCountries = document.querySelector("#search-country");
const singleCountryDisplay = document.querySelector("#country-display");
// const themeToggleBtn = document.querySelector("#mode-btn");
const themeBtns = document.querySelectorAll(".single-mode-btn");
// const darkModeBtn = document.querySelector("#dark-mode-btn");
// const lightModeBtn = document.querySelector("#light-mode-btn");
const header = document.querySelector("#header");

const filterWrapper = document.querySelector("#filter-wrapper");
const searchWrapper = document.querySelector("#search-wrapper");
const eachCountryDetailsWrapper = document.querySelectorAll(
  ".eachCountryDetails-wrapper"
);
// const backBtn = document.querySelector("#back-btn");
const elementsToChange = [
  header,
  filterWrapper,
  searchWrapper,
  ...themeBtns,
  ...eachCountryDetailsWrapper
  // backBtn
];

console.log(elementsToChange);
fetchData();

async function fetchData() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");

    !response.ok && new Error("Unable to fetch countries data");

    const data = await response.json();
    // const data = API_DATA;
    uniqueRegions(data);
    displayCountries(data);
    filterCountriesByRegion(data);
    getSearchData(data);
    handleCountryToDisplay(data);
  } catch (error) {
    console.error(error);
  }
}

function uniqueRegions(data) {
  const uniqueRegionsSet = new Set();
  data.map((country) => uniqueRegionsSet.add(country.region));
  displayRegion([...uniqueRegionsSet]);
}

function displayRegion(regionList) {
  regionList.map((region) => {
    const optionEl = document.createElement("option");
    optionEl.value = region;
    optionEl.innerText = region;
    regionsDisplay && regionsDisplay.appendChild(optionEl);
  });
}

function displayCountries(data) {
  data.map((country) => {
    displayAllCountries &&
      (displayAllCountries.innerHTML += `  <a href="../restCountriesProject/display-country.html?country-code=${
        country.cca2
      }">
        <div class="eachCountry">
            <img src="${country.flags.svg}" alt="${
        country.flags.alt ? country.flags.alt : ""
      }" srcset="">
            <div class="eachCountryDetails-wrapper">
                <h6>${country.name.common}</h6>
                <div class="eachCountry-details">
                    <p><span>Population:</span><span>${country.population.toLocaleString()}</span></p>
                    <p><span>Region:</span><span>${country.region}</span></p>
                    <p><span>Capital:</span><span>${country.capital}</span></p>
                </div>
            </div>
        </div>
    </a>`);
  });
}

function filterCountriesByRegion(data) {
  filterByRegion &&
    filterByRegion.addEventListener("change", (e) => {
      const filterValue = e.target.value;

      const filteredCountries = data.filter((country) => {
        return country.region === filterValue;
      });
      getCountriesToDisplay(filteredCountries);
    });
}

function getCountriesToDisplay(filteredData) {
  displayAllCountries.innerHTML = ``;
  filteredData.map((country) => {
    displayAllCountries &&
      (displayAllCountries.innerHTML += `  <a href="/restCountriesProject/display-country.html?country-code=${
        country.cca2
      }">
    <div class="eachCountry">
    <img src="${country.flags.svg}" alt="${
        country.flags.alt ? country.flags.alt : ""
      }" srcset="">
            <div class="eachCountryDetails-wrapper">
                <h6>${country.name.common}</h6>
                <div class="eachCountry-details">
                    <p><span>Population:</span><span>${country.population.toLocaleString()}</span></p>
                    <p><span>Region:</span><span>${country.region}</span></p>
                    <p><span>Capital:</span><span>${country.capital}</span></p>
                </div>
            </div>
            </div>
            </a>`);
  });
}

function getSearchData(data) {
  searchCountries &&
    searchCountries.addEventListener("keyup", (e) => {
      const searchValue = e.target.value;
      console.log(searchValue);
      const filterBySearch = data.filter((country) => {
        return country.name.common.includes(searchValue);
      });
      getCountriesToDisplay(filterBySearch);
    });
}

function handleCountryToDisplay(data) {
  const searchParams = new URLSearchParams(window.location.search);
  const countryCode = searchParams.get("country-code");
  const countryToDisplay = data.find((country) => {
    return country.cca2 === countryCode;
  });

  displayClickedCountry(countryToDisplay);
}

function displayClickedCountry(countryObj) {
  for (const key in countryObj.currencies) {
    countryObj.currencies
      ? (countryObj.currencies = countryObj.currencies[key].name)
      : "";
    // countryObj.currenciesSymbol = countryObj.currencies[key].symbol;
  }

  for (const key in countryObj.languages) {
    countryObj.languages = countryObj.languages[key];
  }
  singleCountryDisplay.innerHTML = `    <div><img src="${
    countryObj.flags.svg
  }" alt=${countryObj.flags.alt}></div>
  <div class="display-country-details">
      <div>
          <h3>${countryObj.name.common}</h3>
      </div>
      <div>
          <div>
              <p><span>Native name:</span><span>${
                countryObj.name.official
              }</span></p>
              <p><span>Population:</span><span>${countryObj.population.toLocaleString()}</span></p>
              <p><span>Region:</span><span>${countryObj.region}</span></p>
              <p><span>Sub region:</span><span>${
                countryObj.subregion
              }</span></p>
              <p><span>Capital:</span><span>${countryObj.capital}</span></p>
          </div>
          <div>
              <p><span>Top level domain:</span><span>${
                countryObj.tld
              }</span></p>
              <p><span>Currencies:</span><span>${
                countryObj.currencies
              }</span></p>
              <p><span>Languages:</span><span>${countryObj.languages}</span></p>
          </div>
      </div>
      <div class="border-countries" id="border-countries">
          <h6>Border countries:</h6>

      </div>
  </div>`;
}

// TOGGLE

themeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    handleToggle();
    changePageDisplay();
  });
});

function handleToggle() {
  setTheme = !setTheme;
}

function changePageDisplay() {
  !setTheme
    ? elementsToChange.forEach((element) => {
        element && element.classList.remove("light-mode-el");
        element && element.classList.add("dark-mode-el");
        body.classList.remove("light-mode-bg");
        body.classList.add("dark-mode-bg");
        themeBtns[0].classList.remove("display-flex");
        themeBtns[0].classList.add("display-none");
        themeBtns[1].classList.remove("display-none");
        themeBtns[1].classList.add("display-flex");
      })
    : elementsToChange.forEach((element) => {
        element && element.classList.remove("dark-mode-el");
        element && element.classList.add("light-mode-el");
        element && element.classList.remove("dark-mode-bg");
        body.classList.add("light-mode-bg");
        themeBtns[0].classList.remove("display-none");
        themeBtns[0].classList.add("display-flex");
        themeBtns[1].classList.remove("display-flex");
        themeBtns[1].classList.add("display-none");
      });
}
