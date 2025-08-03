const form = document.querySelector(".search-section");
let Name = document.querySelector(".name");
let Image = document.querySelector(".icon");
let Temperature = document.querySelector(".temp");
let Description = document.querySelector(".description");
let Humidity = document.querySelector(".h p");
let WindSpeed = document.querySelector(".w p");
let Sunrise = document.querySelector(".time-r");
let Sunset = document.querySelector(".time-s");


let details = document.querySelectorAll(".HideElements")
let hw = details[2]
let error404 = document.querySelector(".error-message")




form.addEventListener("submit", async (e) => {

    e.preventDefault()

    let City = document.getElementById("city").value.trim();

    if (!City) {
        alert("Please enter a city name.");
        return;
    }

    const apikey = '594f7a8d467d718519a6052b0d4d3e2b';
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${City}&units=metric&appid=${apikey}`;

    try {
        const res = await fetch(api);
        const data = await res.json();
        
        document.getElementById("city").value = ''

        if(data.cod !== 200){
            details.forEach(detail => detail.style.display = "none");
            error404.style.display = "block";
            error404.classList.remove("animate-error"); 
            void error404.offsetWidth; 
            error404.classList.add("animate-error"); 
            hw.style.display = "none"
            return;
        }
        else{
            details.forEach(detail => detail.style.display = "block");
            error404.style.display = "none";
            hw.style.display = "flex"
        }


        const countryCode = data.sys.country.toLowerCase();
        const flagUrl = `https://flagcdn.com/24x18/${countryCode}.png`;
        const flagImg = document.createElement('img');
        flagImg.src = flagUrl;
        flagImg.alt = countryCode + ' flag';
        flagImg.style.width = '26px';

        Name.textContent = data.name;
        Name.appendChild(document.createTextNode(" "))
        Name.appendChild(flagImg)


        switch(data.weather[0].main){
            case 'Clear':
                Image.src = 'clear.png'
                break;
            case 'Rain':
                Image.src = 'rain.png'
                break;
            case 'Snow':
                Image.src = 'snow.png'
                break;
            case 'Clouds':
                Image.src = 'cloud.png'
                break;
            case 'Mist':
                Image.src = 'mist.png'
                break;
            case 'Haze':
                Image.src = 'mist.png'
                break;
            default : 
                Image.src = ''
        }

        Temperature.innerHTML = `${parseInt(data.main.temp)} <span>°C</span>`
        

        Description.textContent = data.weather[0].description

        Humidity.textContent = data.main.humidity + " %";

        WindSpeed.textContent = (data.wind.speed*3.6).toFixed(1) + " km/h";


        Sunrise.textContent = convertUnixToTime(data.sys.sunrise)
        Sunset.textContent = convertUnixToTime(data.sys.sunset)


        animateWeatherSection();

        
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
});

function convertUnixToTime(unixTime) {
  const date = new Date(unixTime * 1000);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = (hours % 12) || 12;
  return `${hours}:${minutes} ${ampm}`;
}


function animateWeatherSection() {
  document.querySelectorAll(".HideElements").forEach((el, index) => {
    el.classList.remove("animate-slide"); // reset if re-search
    void el.offsetWidth; // force reflow to restart animation
    el.style.animationDelay = `${index * 100}ms`;
    el.classList.add("animate-slide");
  });
}
