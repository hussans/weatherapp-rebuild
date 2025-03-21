'use client';
import { useState, useEffect } from 'react';
import SearchBar from '@/components/ui/SearchBar';
import FavoritesModal from '@/components/ui/FavoritesModal';
import { getWeather, getWeeklyForecast, getWeatherLocation } from './api/weather';

export default function Home() {
  const [location, setLocation] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('weatherFavorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (location && favorites.length > 0) {
      let found = false;
      for (let i = 0; i < favorites.length; i++) {
        if (favorites[i].lat === location.lat && favorites[i].lon === location.lon) {
          found = true;
          break;
        }
      }
      setIsFavorite(found);
    } else {
      setIsFavorite(false);
    }
  }, [location, favorites]);

  async function fetchWeatherData(loc: any) {
    setLoading(true);
    setError(null);
    try {
      const weatherData = await getWeather(loc.lat, loc.lon);
      const forecastData = await getWeeklyForecast(loc.lat, loc.lon);

      setWeather(weatherData);
      setForecast(forecastData);
      setLocation(loc);
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("Failed to load weather data. Please try again.");
    }
    setLoading(false);
  }

  useEffect(() => {
    async function loadInitialLocation() {
      try {
        const stocktonLocation = await getWeatherLocation("Stockton, California");
        fetchWeatherData(stocktonLocation);
      } catch (err) {
        setError("Failed to load initial location. Please try searching for a location.");
        setLoading(false);
      }
    }

    loadInitialLocation();
  }, []);

  async function handleSearch(searchTerm: string) {
    setLoading(true);
    setError(null);
    try {
      const locationData = await getWeatherLocation(searchTerm);
      fetchWeatherData(locationData);
    } catch (err) {
      setError("Location not found. Please try another search.");
      setLoading(false);
    }
  }

  function toggleFavorite() {
    if (!location) return;

    if (isFavorite) {
      let newFavorites = [];
      for (let i = 0; i < favorites.length; i++) {
        if (favorites[i].lat !== location.lat || favorites[i].lon !== location.lon) {
          newFavorites.push(favorites[i]);
        }
      }
      setFavorites(newFavorites);
      setIsFavorite(false);
    } else {
      let newFavorites = [...favorites];
      newFavorites.push(location);
      setFavorites(newFavorites);
      setIsFavorite(true);
    }
  }

  function removeFavorite(favoriteToRemove: any) {
    let newFavorites = [];
    for (let i = 0; i < favorites.length; i++) {
      if (favorites[i].lat !== favoriteToRemove.lat || favorites[i].lon !== favoriteToRemove.lon) {
        newFavorites.push(favorites[i]);
      }
    }
    setFavorites(newFavorites);
  }

  function getDayOfWeek(timestamp: number) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(timestamp * 1000);
    const dayIndex = date.getDay();
    return days[dayIndex];
  }

  function getDailyForecast() {
    if (!forecast || !forecast.list) {
      return [];
    }

    const dailyData: any = {};
    const today = new Date().getDay();

    for (let i = 0; i < forecast.list.length; i++) {
      const item = forecast.list[i];
      const date = new Date(item.dt * 1000);
      const day = date.getDay();

      if (day === today) {
        continue;
      }

      const dayName = getDayOfWeek(item.dt);

      if (!dailyData[dayName]) {
        dailyData[dayName] = {
          temp: item.main.temp,
          day: dayName
        };
      } else if (item.main.temp > dailyData[dayName].temp) {
        dailyData[dayName] = {
          temp: item.main.temp,
          day: dayName
        };
      }
    }

    const result = [];
    for (let key in dailyData) {
      result.push(dailyData[key]);
    }

    if (result.length > 5) {
      return result.slice(0, 5);
    } else {
      return result;
    }
  }

  function handleSelectFavorite(favorite: any) {
    fetchWeatherData(favorite);
    setShowFavorites(false);
  }

  function getWeatherAssets() {
    const defaultAssets = {
      icon: "./icons/rainy-icon.svg",
      background: "./rainyforest.jpg",
      bgColor: "#0F1014"
    };

    if (!weather) {
      return defaultAssets;
    }

    if (!weather.current) {
      return defaultAssets;
    }

    if (!weather.current.weather) {
      return defaultAssets;
    }

    if (weather.current.weather.length === 0) {
      return defaultAssets;
    }

    const condition = weather.current.weather[0].main.toLowerCase();
    const currentTime = new Date().getHours();
    const isNight = currentTime < 6 || currentTime >= 19;

    console.log("Weather condition:", condition, "Is night:", isNight, "Current hour:", currentTime);

    if (condition.includes('clear')) {
      if (isNight) {
        return {
          icon: "./icons/moon-icon.svg",
          background: "./nightfield-bg.jpg",
          bgColor: "#172433"
        };
      } else {
        return {
          icon: "./icons/sun-icon.svg",
          background: "./sunnytrees-bg.jpg",
          bgColor: "#0B200C"
        };
      }
    }

    if (condition.includes('rain') || condition.includes('drizzle')) {
      return {
        icon: "./icons/rainy-icon.svg",
        background: "./rainyforest.jpg",
        bgColor: "#0F1014"
      };
    }

    if (condition.includes('cloud')) {
      if (isNight) {
        return {
          icon: "./icons/cloudy-icon.svg",
          background: "./nightfield-bg.jpg",
          bgColor: "#172433"
        };
      } else {
        return {
          icon: "./icons/cloudy-icon.svg",
          background: "./rainyforest.jpg",
          bgColor: "#0F1014"
        };
      }
    }

    if (isNight) {
      return {
        icon: "./icons/moon-icon.svg",
        background: "./nightfield-bg.jpg",
        bgColor: "#172433"
      };
    }

    return defaultAssets;
  }

  function formatLocationDisplay() {
    if (!location) {
      return "Loading...";
    }

    if (location.country === "US") {
      if (location.state) {
        return location.name + ", " + location.state;
      } else {
        return location.name;
      }
    }

    return location.name + ", " + location.country;
  }

  const dailyForecast = getDailyForecast();
  const weatherAssets = getWeatherAssets();
  const icon = weatherAssets.icon;
  const background = weatherAssets.background;
  const bgColor = weatherAssets.bgColor;

  function getTemperatureDisplay() {
    if (weather) {
      const tempRounded = Math.round(weather.current.temp);
      return tempRounded;
    } else {
      return "N/A";
    }
  }

  function getHighTempDisplay() {
    if (weather) {
      const highTemp = Math.round(weather.daily[0].temp.max);
      return highTemp + "°";
    } else {
      return "N/A°";
    }
  }

  function getLowTempDisplay() {
    if (weather) {
      const lowTemp = Math.round(weather.daily[0].temp.min);
      return lowTemp + "°";
    } else {
      return "N/A°";
    }
  }

  function getStarIconSrc() {
    if (isFavorite) {
      return "./icons/checkedstar-icon.png";
    } else {
      return "./icons/uncheckedstar-icon.png";
    }
  }

  function getStarIconAlt() {
    if (isFavorite) {
      return "Favorited";
    } else {
      return "Not Favorited";
    }
  }

  function renderFavoritesModal() {
    if (!showFavorites) {
      return null;
    }

    return (
      <div className="absolute top-0 right-0 w-full h-full z-10" style={{ backgroundColor: bgColor }}>
        <div className="p-10 h-full relative">
          <div className="flex justify-between items-center">
            <div></div>
            <button
              onClick={function () { setShowFavorites(false); }}
              className="text-white p-2 hover:bg-[#FFFFFF13] rounded-full transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="w-[100%] h-[calc(100%-80px)] bg-[#FFFFFF03] border-1 border-[#FFFFFF13] rounded-2xl mt-9 p-6">
            <div className="font-[Inter-Medium]">
              <p>FAVORITES</p>
            </div>

            <div>
              {favorites.length === 0 && (
                <p className="text-white mt-6"> No favorite locations saved yet. </p>
              )}

              {favorites.length > 0 && (
                <div className="mt-10 space-y-5">
                  {favorites.map(function (favorite, index) {
                    let locationText = favorite.name;
                    if (favorite.state) {
                      locationText += ", " + favorite.state + ", ";
                    } else {
                      locationText += ", ";
                    }
                    locationText += favorite.country;

                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center p-4 bg-[#FFFFFF09] hover:bg-[#FFFFFF15] active:bg-[#FFFFFF05] rounded-lg transition-colors"
                      >
                        <p
                          className="text-white font-[Inter-Medium] cursor-pointer hover:text-gray-300 flex-grow"
                          onClick={function () { handleSelectFavorite(favorite); }}
                        >
                          {locationText}
                        </p>
                        <button
                          onClick={function () { removeFavorite(favorite); }}
                          className="text-white hover:text-red-400 cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function handleFavoritesToggle() {
    setShowFavorites(!showFavorites);
  }

  return (
    <div style={{ backgroundColor: bgColor, transition: "background-color 0.5s ease" }} className="h-screen">
      <div className="flex flex-row h-full">
        <div className="w-1/2 relative">
          <div className="h-full w-full relative">
            <img
              className="block w-full h-full object-cover transition-opacity duration-300"
              src={background}
              alt="Weather Background"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-80px)] h-[calc(100%-80px)] bg-[#FFFFFF03] p-6 backdrop-blur-xs border-1 border-[#FFFFFF13] rounded-2xl flex flex-col justify-between">
              <div>
                <p className="text-white text-xl font-[Inter-Medium]">
                  sanweather
                </p>
              </div>

              <div className="flex justify-center items-center flex-grow">
                <img className="w-[125px]" src={icon} alt="Weather Icon" />
              </div>

              <div className="flex flex-col items-end">
                <div className="w-full flex justify-end">
                  <div className="flex flex-col items-start">
                    <p className="font-[Inter-Medium] text-white text-lg pl-3"> currently </p>
                    <div className="flex items-start">
                      <p className="font-[Inter-Bold] text-white text-9xl">
                        {getTemperatureDisplay()}
                      </p>
                      <span className="font-[Inter-Bold] text-lg text-white mt-3"> °F </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center font-[Inter-Medium] text-white text-5xl gap-5 mt-2 flex-wrap justify-end">
                  <button onClick={toggleFavorite} className="flex-shrink-0 cursor-pointer">
                    <img
                      className="w-[24px]"
                      src={getStarIconSrc()}
                      alt={getStarIconAlt()}
                    />
                  </button>
                  <p className="break-words">
                    {formatLocationDisplay()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2 text-white p-10 relative">
          <SearchBar
            onSearch={handleSearch}
            onFavoritesToggle={handleFavoritesToggle}
          />
          <div className="w-[100%] h-[calc(100%-80px)] bg-[#FFFFFF03] border-1 border-[#FFFFFF13] rounded-2xl mt-9 p-6">
            <div className="font-[Inter-Medium]">
              <p> WEATHER DETAILS </p>
            </div>

            <div className="grid grid-cols-3 font-[Inter-Medium] mt-10 items-center">
              <p className="col-span-1"> High </p>
              <p className="col-span-1 text-center"> {getHighTempDisplay()} </p>
              <div className="col-span-1 flex justify-end">
                <img className="w-[20px]" src="/icons/temp-icon.png" alt="Temperature Icon" />
              </div>
            </div>

            <div className="grid grid-cols-3 font-[Inter-Medium] mt-5 items-center">
              <p className="col-span-1"> Low </p>
              <p className="col-span-1 text-center"> {getLowTempDisplay()} </p>
              <div className="col-span-1 flex justify-end">
                <img className="w-[20px]" src="/icons/temp-icon.png" alt="Temperature Icon" />
              </div>
            </div>

            <div className="flex justify-center items-center mt-10">
              <hr className="bg-white w-[95%] border-0 h-[.1px]" />
            </div>

            <div className="font-[Inter-Medium] mt-10">
              <p> WEEK </p>
            </div>

            <div>
              {dailyForecast.map(function (day, index) {
                const tempRounded = Math.round(day.temp);

                return (
                  <div key={index} className="grid grid-cols-3 font-[Inter-Medium] mt-10 items-center">
                    <p className="col-span-1"> {day.day} </p>
                    <p className="col-span-1 text-center"> {tempRounded}° </p>
                    <div className="col-span-1 flex justify-end">
                      <p>F</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {renderFavoritesModal()}
        </div>
      </div>
    </div>
  );
}