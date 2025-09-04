import { useEffect, useState } from "react";
import "./App.css";

import clearIcon from "./assets/clear.png";
import cloudIcon from "./assets/cloud.png";
import drizzleIcon from "./assets/drizzle.png";
import humidityIcon from "./assets/humidity.png";
import rainIcon from "./assets/rain.png";
import searchIcon from "./assets/search.png";
import snowIcon from "./assets/snow.png";
import windIcon from "./assets/wind.png";
import crossIcon from "./assets/cross.png";
import weatherIcon from "./assets/weather.png";

// weather component to show all details
const WeatherDetails = ({
  icon,
  temp,
  city,
  country,
  lat,
  lon,
  humidity,
  wind,
}) => {
  return (
    <>
      {/* icon */}
      <div className="icon flex justify-center m-3">
        <img src={icon} alt="icon" />
      </div>

      {/* temp */}
      <div className="temp text-center text-3xl uppercase font-medium">
        {temp}°c
      </div>
      {/* city name */}
      <div className="city text-center text-3xl uppercase font-normal text-amber-300">
        {city}
      </div>
      {/* country */}
      <div className="country text-center text-lg uppercase font-medium text-gray-400">
        {country}
      </div>

      {/* lat and lon */}
      <div className=" flex justify-center gap-5">
        <div className="flex flex-col items-center">
          <span className="text-sm">Lattitude</span>
          <span className="coord text-gray-400 text-lg font-medium">{lat}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm">Longitude</span>
          <span className="coord text-gray-400 text-lg font-medium">{lon}</span>
        </div>
      </div>

      {/* humidity and wind */}
      <div className="flex justify-between">
        <div className="flex flex-col items-center">
          <img className="h-10" src={humidityIcon} alt="humidity" />
          <div className="data text-gray-400 text-lg font-medium">
            {humidity}%
          </div>
          <div className="text-sm">Humidity</div>
        </div>
        <div className="flex flex-col items-center">
          <img className=" h-10" src={windIcon} alt="humidity" />
          <div className="data text-gray-400 text-lg font-medium">
            {wind}km/h
          </div>
          <div className="text-sm">Wind Speed</div>
        </div>
      </div>
    </>
  );
};

function App() {
  let apiKey = "e14c24c30389df00ab3a1e07d62e33e3";
  let [text, setText] = useState("chennai");

  // all states for weather data
  let [icon, setIcon] = useState(clearIcon);
  let [temp, setTemp] = useState(0);
  let [city, setCity] = useState("chennai");
  let [country, setCountry] = useState("in");
  let [lat, setLat] = useState(0);
  let [lon, setLon] = useState(0);
  let [humidity, setHumidity] = useState(0);
  let [wind, setWind] = useState(0);

  // error states
  let [cityNotFound, setCityNotFound] = useState(false);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(null);

  // weather icons mapping
  const WeatherMapIcon = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  // api call function
  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apiKey}&units=Metric`;
    try {
      let res = await fetch(url);
      let data = await res.json();

      // check if city not found
      if (data.cod === "404") {
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      // update state with api data
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLon(data.coord.lon);
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      let WeatherMapCode = data.weather[0].icon;
      setIcon(WeatherMapIcon[WeatherMapCode] || clearIcon);
      setCityNotFound(false);
    } catch (error) {
      console.error(error.message);
      setError("Error While Fetching Data!");
    } finally {
      setLoading(false);
    }
  };

  // input change handler
  const handleCity = (e) => {
    setText(e.target.value);
  };

  // enter key handler
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  // initial load
  useEffect(() => {
    search();
  }, []);

  return (
    <>
      {/* header */}
      <div className="flex justify-center items-center gap-0.5 mb-3">
        <img className="h-15" src={weatherIcon} alt="weatherIcon" />
        <div className="text-4xl font-semibold  text-blue-900">Weather App</div>
      </div>

      {/* main container */}
      <div className="container w-80 md:w-96 bg-white justify-center rounded-4xl p-5 shadow-[0px_1px_16px_2px_rgba(0,_0,_0,_0.1)]">
        {/* search input */}
        <div className="flex w-full border-2 border-blue-300 rounded-full overflow-hidden">
          <input
            type="text"
            className="flex-1 w-full outline-none py-2 px-4 text-lg"
            onChange={handleCity}
            onKeyDown={handleSearch}
            value={text}
          />
          <button
            onClick={search}
            className="flex items-center justify-center bg-blue-300 px-4"
          >
            <img
              className="h-5 w-5 sm:h-6 sm:w-6"
              src={searchIcon}
              alt="search"
            />
          </button>
        </div>

        {/* city not found error */}
        {cityNotFound && (
          <div className="error-handling text-3xl font-medium m-5 flex flex-col items-center gap-3 ">
            <div>City Not Found</div>
            <div>
              <img className="h-10 w-10" src={crossIcon} alt="cross" />
            </div>
          </div>
        )}

        {/* loading */}
        {loading && (
          <div className="text-center text-[20px] m-5">Loading...</div>
        )}

        {/* api error */}
        {error && (
          <div className="error-handling text-center text-3xl font-medium m-5 flex flex-col items-center gap-3 ">
            <div>{error}</div>
            <div>
              <img className="h-10 w-10" src={crossIcon} alt="cross" />
            </div>
          </div>
        )}

        {/* weather details */}
        {!loading && !cityNotFound && !error && (
          <WeatherDetails
            icon={icon}
            temp={temp}
            city={city}
            country={country}
            lat={lat}
            lon={lon}
            humidity={humidity}
            wind={wind}
          />
        )}
      </div>
    </>
  );
}

export default App;
