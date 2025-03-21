import { OPENWEATHER_API_KEY } from "@/lib/environment";

const APIKEY = OPENWEATHER_API_KEY;

export interface WeatherLocation {
    name: string;
    lat: number;
    lon: number;
    state?: string;
    country: string;
}

export async function getWeather(lat: number, lon: number) {
    try {
        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=imperial`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Weather Location Error");
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error("Error in getWeather: ", error.message);
        throw error;
    }
}

export async function getWeeklyForecast(lat: number, lon: number) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=imperial`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Forecast Error");
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error("Error in getWeeklyForecast: ", error.message);
        throw error;
    }
}

export async function getWeatherLocation(city: string): Promise<WeatherLocation> {
    try {
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIKEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Location Error");
        }

        const data = await response.json();

        if (data.length === 0) {
            throw new Error("No location data found");
        }

        return data[0];
    } catch (error: any) {
        console.error("Error in getWeatherLocation: ", error.message);
        throw error;
    }
}