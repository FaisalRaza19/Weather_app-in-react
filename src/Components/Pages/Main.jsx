import React, { useEffect, useRef, useState } from 'react';
import { Cloud, Search, Droplet, Wind, Sun, Sunrise, Sunset } from 'lucide-react';

const OPENWEATHER_API_KEY = import.meta.env.VITE_API_KEY;

// Convert Unix time → HH:MM
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

// Map weather → icon
const getWeatherIcon = (condition) => {
    if (!condition) return Cloud;
    const c = condition.toLowerCase();
    if (c.includes('clear')) return Sun;
    if (c.includes('cloud')) return Cloud;
    if (c.includes('rain') || c.includes('drizzle')) return Droplet;
    if (c.includes('snow')) return Droplet;
    if (c.includes('thunder')) return Droplet;
    return Cloud;
};

// Core Weather Fetcher
const fetchWeatherData = async (city, setWeather, setLoading, setError) => {
    if (!city.trim()) {
        setError("Please enter a valid city name.");
        return;
    }

    if (!OPENWEATHER_API_KEY) {
        setError("Missing API key. Add VITE_API_KEY in .env");
        return;
    }

    setLoading(true);
    setError(null);

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`;
        const response = await fetch(url);
        const result = await response.json();

        if (response.status === 404) {
            setError(`City "${city}" not found.`);
            setWeather(INITIAL_WEATHER_STATE);
            return;
        }
        if (response.status === 401) {
            setError("Invalid API Key (401).");
            setWeather(INITIAL_WEATHER_STATE);
            return;
        }
        if (!response.ok) {
            setError(result.message || "Weather service error.");
            setWeather(INITIAL_WEATHER_STATE);
            return;
        }

        const condition = result.weather?.[0]?.main || "N/A";
        const Icon = getWeatherIcon(condition);

        setWeather({
            name: result.name,
            temp: Math.round(result.main.temp) + "°C",
            minTemp: Math.round(result.main.temp_min) + "°C",
            maxTemp: Math.round(result.main.temp_max) + "°C",
            condition,
            icon: Icon,
            humidity: result.main.humidity + "%",
            feelsLike: Math.round(result.main.feels_like) + "°C",
            wind: (result.wind.speed * 3.6).toFixed(1) + " Km/h",
            sunrise: result.sys.sunrise,
            sunset: result.sys.sunset,
        });

    } catch {
        setError("Unable to connect to weather service.");
    } finally {
        setLoading(false);
    }
};

// main component
const Main = () => {
    const inputRef = useRef(null);
    const [weather, setWeather] = useState(INITIAL_WEATHER_STATE);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load default
    useEffect(() => {
        if (OPENWEATHER_API_KEY) {
            fetchWeatherData("London", setWeather, setLoading, setError);
        } else {
            setError("Please add VITE_API_KEY to .env");
        }
    }, []);

    const searchWeather = () => {
        const city = inputRef.current.value.trim();
        fetchWeatherData(city, setWeather, setLoading, setError);
        inputRef.current.value = "";
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") searchWeather();
    };

    const WeatherIcon = weather.icon;

    return (
        <div className="min-h-screen bg-gray-100 p-4 font-inter">

            {/* Header */}
            <header className="bg-white shadow-lg rounded-xl mb-8 p-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center text-3xl font-extrabold text-blue-600 mb-4 md:mb-0">
                        <Cloud className="w-8 h-8 mr-2" /> WeatherWise
                    </div>

                    {/* Search bar */}
                    <div className="flex w-full md:w-auto">
                        <input
                            ref={inputRef}
                            placeholder="Enter city..."
                            onKeyDown={handleKeyDown}
                            className="w-full px-4 py-2 border rounded-l-lg"
                        />
                        <button
                            onClick={searchWeather}
                            disabled={loading}
                            className="bg-blue-600 text-white p-2 rounded-r-lg"
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
                {error && (
                    <div className="bg-red-100 border text-red-700 px-4 py-3 rounded-xl mb-6 text-center">
                        <span className="font-bold">Error:</span> {error}
                    </div>
                )}

                <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                    Weather for <span className="text-blue-600">{weather.name}</span>
                </h1>

                {/* Main Weather Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-10 flex flex-col lg:flex-row justify-between items-center">
                    <div className="text-center lg:text-left">
                        <WeatherIcon className="w-24 h-24 text-blue-500 mx-auto lg:mx-0" />
                        <p className="text-2xl font-semibold text-gray-600">{weather.condition}</p>
                    </div>

                    <div className="text-center">
                        <div className="text-7xl font-bold">{weather.temp}</div>
                        <div className="text-lg text-gray-500">Feels Like: {weather.feelsLike}</div>
                    </div>

                    <div className="text-center lg:text-right pt-4 lg:pt-0 border-t lg:border-l lg:pl-6">
                        <p className="text-gray-600">Min: <span className="text-blue-500">{weather.minTemp}</span></p>
                        <p className="text-gray-600">Max: <span className="text-red-500">{weather.maxTemp}</span></p>
                    </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    <DetailCard icon={Droplet} title="Humidity" value={weather.humidity} color="bg-green-100" iconColor="text-green-500" description={`Feels like ${weather.feelsLike}.`} />

                    <DetailCard icon={Wind} title="Wind Speed" value={weather.wind} color="bg-purple-100" iconColor="text-purple-500" description="Strong winds reported." />

                    <div className="bg-white rounded-xl shadow-md p-6 border-b-4 border-yellow-500">
                        <div className="flex items-center mb-3">
                            <Sun className="w-6 h-6 text-yellow-500 mr-3" />
                            <h3 className="text-xl font-semibold">Solar Cycle</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between p-2 bg-yellow-50 rounded-lg">
                                <span className="flex items-center text-gray-600"><Sunrise className="w-4 h-4 mr-2" /> Sunrise:</span>
                                <span className="font-bold">{formatTime(weather.sunrise)}</span>
                            </div>

                            <div className="flex justify-between p-2 bg-yellow-50 rounded-lg">
                                <span className="flex items-center text-gray-600"><Sunset className="w-4 h-4 mr-2" /> Sunset:</span>
                                <span className="font-bold">{formatTime(weather.sunset)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="mt-10 pt-4 text-center text-gray-500 text-sm">
                Powered by OpenWeatherMap.
            </footer>
        </div>
    );
};

export default Main;

const DetailCard = ({ icon: Icon, title, value, color, iconColor, description }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border-b-4 border-blue-500">
        <div className={`p-3 w-12 h-12 rounded-full ${color} flex items-center justify-center mb-3`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-4xl font-extrabold">{value}</p>
        <p className="text-sm text-gray-500">{description}</p>
    </div>
);
