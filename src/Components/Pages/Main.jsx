// import React, { useEffect, useRef, useState } from 'react'
// import Pic1 from "../assets/Pic1.jpg";

// const Main = () => {
//     const inputRef = useRef()
//     const [weather, setWeather] = useState(false);

//     const fetchData = async (city) => {
//         if (city === "") {
//             alert("Enter city name");
//             return null;
//         }
//         try {
//             const ApiKey =  import.meta.env.VITE_API_KEY;
//             const ApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${ApiKey}`;
//             const data = await fetch(ApiUrl);
//             const result = await data.json();
//             setWeather({
//                 name: result.name || "....",
//                 temp: Math.round(result.main.temp) + "°c" || "....",
//                 minTemp: Math.round(result.main.temp_min) + "°c",
//                 maxTemp: Math.round(result.main.temp_max) + "°c",
//                 condition: result.weather[0].main,
//                 windDeg: result.wind.deg,
//                 humidity: Math.round(result.main.humidity) + "%" || "....",
//                 fell: result.main.feels_like + "%",
//                 wind: result.wind.speed + " Km/hr",
//                 sunrise: result.sys.sunrise,
//                 sunset: result.sys.sunset
//             })

//         } catch (error) {
//             console.log("Api Error")
//         }
//     };

//     useEffect(() => {
//         fetchData("london")
//     }, []);

//     const searchWeather = ()=>{
//         fetchData(inputRef.current.value);
//         inputRef.current = "";
//     }

//     return (
//         <>
//             <nav className="navbar navbar-expand-lg navbar-light bg-light">
//                 <div className="container-fluid">
//                     <a className="navbar-brand fs-3 mx-3" href="#"><img src={Pic1} className='mb-2 mx-1' alt="" width={40} /> Weather App</a>
//                     <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//                         <span className="navbar-toggler-icon"></span>
//                     </button>
//                     <div className="collapse navbar-collapse" id="navbarSupportedContent">
//                         <ul className="navbar-nav me-auto mb-2 mb-lg-0 mx-5">
//                             <li className="nav-item">
//                                 <a className="nav-link active fs-5 mx-4" aria-current="page" href="#">Home</a>
//                             </li>
//                             <li className="nav-item">
//                                 <a className="nav-link active fs-5 mx-4" href="#">About Us</a>
//                             </li>
//                             <li className="nav-item">
//                                 <a className="nav-link active fs-5 mx-4" href="#">Contact Us</a>
//                             </li>
//                         </ul>
//                         <div className="d-flex">
//                             <input className="form-control me-2" ref={inputRef} type="search" placeholder="Enter City...." />
//                             <button className="btn btn-success" onClick={searchWeather}>Search</button>
//                         </div>
//                     </div>
//                 </div>
//             </nav>
//             <div className="container my-5" style={{ textAlign: "center" }}>
//                 <h1>Weather Of <span className="city">{weather.name}</span></h1>
//                 <div className="d-flex position-relative my-5">
//                     <div className="card" style={{ width: "25rem" }}>
//                         <h2 className="card-header">Temperatures</h2>
//                         <div className="card-body">
//                             <h2 className="card-title my-3 temp">{weather.temp}</h2>
//                             <h5>Temperture Is : <span className="temperture">{weather.temp}</span></h5>
//                             <h6>Min Temperture Is : <span className="min-temperture">{weather.minTemp}</span></h6>
//                             <h6>Max Temperture Is : <span className="max-temperture">{weather.maxTemp}</span></h6>
//                             <h6>Weather Condition : <span className="condition">{weather.condition}</span></h6>
//                         </div>
//                     </div>
//                     <div className="card mx-4" style={{ width: "25rem" }}>
//                         <h2 className="card-header">Humidity Info</h2>
//                         <div className="card-body">
//                             <h2 className="card-title my-3 humidity">{weather.humidity}</h2>
//                             <h5>Wind Degree is : <span className="wind-degree">{weather.windDeg}</span></h5>
//                             <h6>Feel Like : <span className="feel-humi">{weather.fell}</span></h6>
//                             <h6>Humidty is : <span className="Humidity">{weather.humidity}</span></h6>
//                         </div>
//                     </div>
//                     <div className="card" style={{ width: "25rem" }}>
//                         <h2 className="card-header">Wind Info</h2>
//                         <div className="card-body">
//                             <h2 className="card-title my-3 wind">{weather.wind}</h2>
//                             <h5>Wind Speed Is : <span className="wind-speed">{weather.wind}</span></h5>
//                             <h6>Sunrise Time is : <span className="sunrise">{weather.sunrise}</span></h6>
//                             <h6>Sunset Time is : <span className="sunset">{weather.sunset}</span></h6>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default Main;



import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Cloud, Search, Droplet, Wind, Sun, Sunrise, Sunset, Thermometer } from 'lucide-react';

const OPENWEATHER_API_KEY = import.meta.env.VITE_API_KEY;

// convert Unix timestamp to HH:MM format
const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const INITIAL_WEATHER_STATE = {
    name: "Awaiting Data",
    temp: "—",
    minTemp: "—",
    maxTemp: "—",
    condition: "Clear Sky",
    icon: Cloud,
    humidity: "—",
    feelsLike: "—",
    wind: "—",
    sunrise: 0,
    sunset: 0,
};

// Map OpenWeather condition to Lucide icon
const getWeatherIcon = (condition) => {
    if (!condition) return Cloud;
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('clear')) return Sun;
    if (lowerCondition.includes('cloud')) return Cloud;
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) return Droplet;
    if (lowerCondition.includes('snow')) return Droplet;
    if (lowerCondition.includes('thunder')) return Droplet;
    return Cloud;
};

const Main = ()=>{
    const inputRef = useRef(null);
    const [weather, setWeather] = useState(INITIAL_WEATHER_STATE);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (city) => {
        if (!city || city.trim() === "") {
            setError("Please enter a valid city name.");
            setWeather(INITIAL_WEATHER_STATE);
            return;
        }

        if (OPENWEATHER_API_KEY) {
             setError("API Key Error: Please replace 'YOUR_OPENWEATHER_API_KEY_HERE' with your actual key.");
             setWeather(INITIAL_WEATHER_STATE);
             return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const ApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`;
            const response = await fetch(ApiUrl);
            const result = await response.json();

            if (response.status === 404) {
                setError(`City "${city}" not found.`);
                setWeather(INITIAL_WEATHER_STATE);
                return;
            }
            if (response.status === 401) {
                setError("Authorization Failed (401). Check your API Key for OpenWeatherMap.");
                setWeather(INITIAL_WEATHER_STATE);
                return;
            }
            if (!response.ok) {
                 setError(`API Error: ${result.message || response.statusText}`);
                 setWeather(INITIAL_WEATHER_STATE);
                 return;
            }

            const currentCondition = result.weather?.[0]?.main || 'N/A';
            const CurrentIcon = getWeatherIcon(currentCondition);

            setWeather({
                name: result.name || "N/A",
                temp: Math.round(result.main.temp) + "°C",
                minTemp: Math.round(result.main.temp_min) + "°C",
                maxTemp: Math.round(result.main.temp_max) + "°C",
                condition: currentCondition,
                icon: CurrentIcon,
                humidity: Math.round(result.main.humidity) + "%",
                feelsLike: Math.round(result.main.feels_like) + "°C",
                wind: (result.wind.speed * 3.6).toFixed(1) + " Km/h", // Convert m/s to Km/h
                sunrise: result.sys.sunrise,
                sunset: result.sys.sunset,
            });

        } catch (err) {
            console.error("Fetch error:", err);
            setError("Could not connect to the weather service. Check your connection.");
            setWeather(INITIAL_WEATHER_STATE);
        } finally {
            setLoading(false);
        }
    };

    // Initial load: Fetch weather for London
    useEffect(() => {
        if (OPENWEATHER_API_KEY !== "YOUR_OPENWEATHER_API_KEY_HERE") {
            fetchData("London");
        } else {
             setError("Please set your OpenWeatherMap API key in the code.");
        }
    }, []);

    const searchWeather = () => {
        if (inputRef.current) {
            const city = inputRef.current.value.trim();
            fetchData(city);
            inputRef.current.value = "";
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            searchWeather();
        }
    };

    const WeatherIcon = weather.icon;

    return (
        <div className="min-h-screen bg-gray-100 p-4 font-inter">
            {/* Header / Navbar */}
            <header className="bg-white shadow-lg rounded-xl mb-8 p-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center text-3xl font-extrabold text-blue-600 mb-4 md:mb-0">
                        <Cloud className="w-8 h-8 mr-2" /> WeatherWise
                    </div>
                    
                    {/* Search Bar */}
                    <div className="flex w-full md:w-auto">
                        <input
                            ref={inputRef}
                            type="search"
                            placeholder="Enter City..."
                            onKeyDown={handleKeyDown}
                            className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        />
                        <button
                            onClick={searchWeather}
                            disabled={loading}
                            className="flex items-center justify-center bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 transition duration-150 disabled:bg-blue-400"
                        >
                            {loading ? (
                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                            ) : (
                                <Search className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto">
                {/* Error Message Display */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6 text-center" role="alert">
                        <span className="font-bold">Error:</span> {error}
                    </div>
                )}

                <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                    Weather for <span className="text-blue-600">{weather.name}</span>
                </h1>

                {/* Main Weather Card */}
                <div className="bg-white shadow-2xl rounded-3xl p-8 mb-10 flex flex-col lg:flex-row items-center justify-between transition-all duration-300 transform hover:scale-[1.01] border-b-8 border-blue-500">
                    <div className="text-center lg:text-left lg:w-1/3 mb-6 lg:mb-0">
                        <WeatherIcon className="w-24 h-24 text-blue-500 mx-auto lg:mx-0 animate-pulse" />
                        <p className="text-2xl font-semibold mt-2 text-gray-600">{weather.condition}</p>
                    </div>

                    <div className="text-center lg:w-1/3">
                        <div className="text-7xl font-bold text-gray-900 leading-none mb-1">
                            {weather.temp}
                        </div>
                        <div className="text-lg text-gray-500">
                            Feels Like: {weather.feelsLike}
                        </div>
                    </div>

                    <div className="lg:w-1/3 text-center lg:text-right pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-200 lg:pl-6">
                        <p className="text-md font-medium text-gray-600">Min Temp: <span className="text-blue-500">{weather.minTemp}</span></p>
                        <p className="text-md font-medium text-gray-600">Max Temp: <span className="text-red-500">{weather.maxTemp}</span></p>
                    </div>
                </div>

                {/* Detail Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1: Humidity */}
                    <DetailCard icon={Droplet} title="Humidity" value={weather.humidity} color="bg-green-100" iconColor="text-green-500" description={`It feels like ${weather.feelsLike}.`} />

                    {/* Card 2: Wind */}
                    <DetailCard icon={Wind} title="Wind Speed" value={weather.wind} color="bg-purple-100" iconColor="text-purple-500" description="Stay safe and check for gusts." />

                    {/* Card 3: Sunrise & Sunset */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-b-4 border-yellow-500 transition duration-300 hover:shadow-xl">
                        <div className="flex items-center mb-3">
                            <Sun className="w-6 h-6 text-yellow-500 mr-3" />
                            <h3 className="text-xl font-semibold text-gray-700">Solar Cycle</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                                <span className="flex items-center text-sm font-medium text-gray-600"><Sunrise className="w-4 h-4 mr-2" /> Sunrise:</span>
                                <span className="text-lg font-bold text-gray-800">{formatTime(weather.sunrise)}</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                                <span className="flex items-center text-sm font-medium text-gray-600"><Sunset className="w-4 h-4 mr-2" /> Sunset:</span>
                                <span className="text-lg font-bold text-gray-800">{formatTime(weather.sunset)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="mt-10 pt-4 border-t border-gray-300 text-center text-gray-500 text-sm">
                Powered by OpenWeatherMap. Please insert your API key into the source code.
            </footer>
        </div>
    );
}

export default Main;

// Reusable Detail Card component
const DetailCard = ({ icon: Icon, title, value, color, iconColor, description }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border-b-4 border-blue-500 transition duration-300 hover:shadow-xl">
        <div className={`p-3 w-12 h-12 rounded-full ${color} flex items-center justify-center mb-3`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
        <p className="text-4xl font-extrabold text-gray-900 mb-2">{value}</p>
        <p className="text-sm text-gray-500">{description}</p>
    </div>
);
