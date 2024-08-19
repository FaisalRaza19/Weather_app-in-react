import React, { useEffect, useRef, useState } from 'react'
import Pic1 from "../assets/Pic1.jpg";

const Main = () => {
    const inputRef = useRef()
    const [weather, setWeather] = useState(false);

    const fetchData = async (city) => {
        if (city === "") {
            alert("Enter city name");
            return null;
        }
        try {
            const ApiKey =  process.env.API_KEY;
            const ApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${ApiKey}`;
            const data = await fetch(ApiUrl);
            const result = await data.json();
            setWeather({
                name: result.name || "....",
                temp: Math.round(result.main.temp) + "°c" || "....",
                minTemp: Math.round(result.main.temp_min) + "°c",
                maxTemp: Math.round(result.main.temp_max) + "°c",
                condition: result.weather[0].main,
                windDeg: result.wind.deg,
                humidity: Math.round(result.main.humidity) + "%" || "....",
                fell: result.main.feels_like + "%",
                wind: result.wind.speed + " Km/hr",
                sunrise: result.sys.sunrise,
                sunset: result.sys.sunset
            })

        } catch (error) {
            console.log("Api Error")
        }
    };

    useEffect(() => {
        fetchData("london")
    }, []);

    const searchWeather = ()=>{
        fetchData(inputRef.current.value);
        inputRef.current = "";
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand fs-3 mx-3" href="#"><img src={Pic1} className='mb-2 mx-1' alt="" width={40} /> Weather App</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 mx-5">
                            <li className="nav-item">
                                <a className="nav-link active fs-5 mx-4" aria-current="page" href="#">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active fs-5 mx-4" href="#">About Us</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active fs-5 mx-4" href="#">Contact Us</a>
                            </li>
                        </ul>
                        <div className="d-flex">
                            <input className="form-control me-2" ref={inputRef} type="search" placeholder="Enter City...." />
                            <button className="btn btn-success" onClick={searchWeather}>Search</button>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="container my-5" style={{ textAlign: "center" }}>
                <h1>Weather Of <span className="city">{weather.name}</span></h1>
                <div className="d-flex position-relative my-5">
                    <div className="card" style={{ width: "25rem" }}>
                        <h2 className="card-header">Temperatures</h2>
                        <div className="card-body">
                            <h2 className="card-title my-3 temp">{weather.temp}</h2>
                            <h5>Temperture Is : <span className="temperture">{weather.temp}</span></h5>
                            <h6>Min Temperture Is : <span className="min-temperture">{weather.minTemp}</span></h6>
                            <h6>Max Temperture Is : <span className="max-temperture">{weather.maxTemp}</span></h6>
                            <h6>Weather Condition : <span className="condition">{weather.condition}</span></h6>
                        </div>
                    </div>
                    <div className="card mx-4" style={{ width: "25rem" }}>
                        <h2 className="card-header">Humidity Info</h2>
                        <div className="card-body">
                            <h2 className="card-title my-3 humidity">{weather.humidity}</h2>
                            <h5>Wind Degree is : <span className="wind-degree">{weather.windDeg}</span></h5>
                            <h6>Feel Like : <span className="feel-humi">{weather.fell}</span></h6>
                            <h6>Humidty is : <span className="Humidity">{weather.humidity}</span></h6>
                        </div>
                    </div>
                    <div className="card" style={{ width: "25rem" }}>
                        <h2 className="card-header">Wind Info</h2>
                        <div className="card-body">
                            <h2 className="card-title my-3 wind">{weather.wind}</h2>
                            <h5>Wind Speed Is : <span className="wind-speed">{weather.wind}</span></h5>
                            <h6>Sunrise Time is : <span className="sunrise">{weather.sunrise}</span></h6>
                            <h6>Sunset Time is : <span className="sunset">{weather.sunset}</span></h6>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Main;
