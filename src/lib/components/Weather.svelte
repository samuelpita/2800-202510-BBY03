<script lang="ts">
    import { onMount } from "svelte";

    let temp: number | null = null;
    let condition: string | null = null;
    let locationName: string | null = null;
    let errorMsg: string | null = null;

    const apiKey = 'b6fd4fd95523410a941184445250905'; // 🔁 Replace with your actual WeatherAPI key

    onMount(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(fetchWeather, showError);
        } else {
            errorMsg = "Geolocation is not supported by this browser.";
        }
    });

    async function fetchWeather(position: GeolocationPosition) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
            const res = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`
            );

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            temp = data.current.temp_c;
            condition = data.current.condition.text;
            locationName = data.location.name;
        } catch (err) {
            errorMsg = "Failed to fetch weather data.";
            console.error(err);
        }
    }

    function showError() {
        errorMsg = "Unable to retrieve your location.";
    }
</script>

{#if errorMsg}
    <div class="weather-error">{errorMsg}</div>
{:else if temp !== null && condition && locationName}
    <div class="weather-box">
        📍 {locationName} · 🌤️ {temp}°C · {condition}
    </div>
{/if}
