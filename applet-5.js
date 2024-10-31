{
    "WeatherApp": {
      "constructor": {
        "variables": {
          "cityInput": "document.getElementById('cityInput')",
          "getWeatherBtn": "document.getElementById('getWeatherBtn')",
          "getLocationBtn": "document.getElementById('getLocationBtn')",
          "weatherCard": "document.getElementById('weatherCard')",
          "cityName": "document.getElementById('cityName')",
          "temperature": "document.getElementById('temperature')",
          "description": "document.getElementById('description')",
          "humidity": "document.getElementById('humidity')",
          "windSpeed": "document.getElementById('windSpeed')",
          "APIKeyInput": "document.getElementById('apiInput')"
        },
        "eventListeners": [
          {
            "event": "click",
            "target": "getWeatherBtn",
            "method": "fetchWeather"
          },
          {
            "event": "click",
            "target": "getLocationBtn",
            "method": "fetchWeatherByLocation"
          }
        ]
      },
      "displayWeather": {
        "parameters": "data",
        "actions": [
          {
            "target": "cityName",
            "property": "textContent",
            "value": "${data.name}, ${data.sys.country} (${data.coord.lat}, ${data.coord.lon})"
          },
          {
            "target": "temperature",
            "property": "textContent",
            "value": "Temperature: ${data.main.temp} °C"
          },
          {
            "target": "description",
            "property": "textContent",
            "value": "Weather: ${data.weather[0].description}"
          },
          {
            "target": "humidity",
            "property": "textContent",
            "value": "Humidity: ${data.main.humidity}%"
          },
          {
            "target": "windSpeed",
            "property": "textContent",
            "value": "Wind Speed: ${data.wind.speed} m/s"
          },
          {
            "target": "weatherCard",
            "property": "style.display",
            "value": "block"
          }
        ]
      }
    },
    "WeatherService": {
      "extends": "WeatherApp",
      "constructor": {
        "variables": {
          "apiKey": "''"
        }
      },
      "fetchWeather": {
        "actions": [
          {
            "target": "apiKey",
            "value": "this.APIKeyInput.value.trim()"
          },
          {
            "condition": "!this.apiKey",
            "action": "alert('Please enter your API key.')"
          },
          {
            "target": "city",
            "value": "this.cityInput.value"
          },
          {
            "condition": "city",
            "action": "const data = await this.getWeatherData(city)"
          },
          {
            "condition": "data",
            "action": "this.displayWeather(data)"
          },
          {
            "condition": "!data",
            "action": "alert('City not found. Please try again.')"
          },
          {
            "condition": "!city",
            "action": "alert('Please enter a city name.')"
          }
        ]
      },
      "fetchWeatherByLocation": {
        "actions": [
          {
            "condition": "navigator.geolocation",
            "action": {
              "method": "navigator.geolocation.getCurrentPosition",
              "success": {
                "actions": [
                  {
                    "target": "latitude",
                    "value": "position.coords.latitude"
                  },
                  {
                    "target": "longitude",
                    "value": "position.coords.longitude"
                  },
                  {
                    "action": "const data = await this.getWeatherDataByCoordinates(latitude, longitude)"
                  },
                  {
                    "condition": "data",
                    "action": "this.displayWeather(data)"
                  },
                  {
                    "condition": "!data",
                    "action": "alert('Unable to retrieve weather data for your location.')"
                  }
                ]
              },
              "error": {
                "action": "alert('Unable to retrieve your location. Please allow location access.')"
              }
            }
          },
          {
            "condition": "!navigator.geolocation",
            "action": "alert('Geolocation is not supported by this browser.')"
          }
        ]
      },
      "getWeatherData": {
        "parameters": "city",
        "actions": [
          {
            "try": {
              "action": {
                "target": "response",
                "value": "await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`)"
              }
            },
            "catch": {
              "action": "console.error('Error fetching weather data:', error)"
            },
            "return": {
              "condition": "response.ok",
              "value": "await response.json()"
            }
          }
        ]
      },
      "getWeatherDataByCoordinates": {
        "parameters": "latitude, longitude",
        "actions": [
          {
            "try": {
              "action": {
                "target": "response",
                "value": "await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`)"
              }
            },
            "catch": {
              "action": "console.error('Error fetching weather data by coordinates:', error)"
            },
            "return": {
              "condition": "response.ok",
              "value": "await response.json()"
            }
          }
        ]
      }
    },
    "instance": {
      "weatherApp": "new WeatherService()"
    }
  }
  