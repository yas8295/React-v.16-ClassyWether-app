import React from "react";
import { motion } from "framer-motion";

function icon(code) {
  const icons = new Map([
    [[0], "☀️"],
    [[1], "🌤"],
    [[2], "⛅️"],
    [[3], "⛅️"],
    [[45, 48], "⛅️"],
    [[51, 56, 61, 66, 80], "🌦️"],
    [[53, 55, 63, 65, 57, 67, 81, 82], "🌧️"],
    [[71, 73, 75, 77, 85, 86], "🌨️"],
    [[95], "🌨️"],
    [[96, 99], "🌨️"],
  ]);
  const i = [...icons.keys()].find((key) => key.includes(code));
  return icons.get(i);
}

class App extends React.Component {
  state = {
    location: "ismailia",
    weather: "",
    city: "",
    loading: false,
    flag: "",
  };

  fetchWeather = async () => {
    if (this.state.location.length < 2) return;

    try {
      this.setState({ loading: true });
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`
      );

      const geoData = await geoRes.json();

      const { latitude, longitude, name, country } = geoData.results.at(0);
      this.setState({ city: name });
      this.setState({ country: country });

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      const weatherData = await weatherRes.json();

      const flagRes = await fetch(
        `https://restcountries.com/v3.1/name/${country}`
      );

      const flagData = await flagRes.json();

      this.setState({ flag: flagData[0].altSpellings.at(0).toLowerCase() });

      this.setState({ weather: weatherData.daily });
    } catch (err) {
    } finally {
      const time = () => {
        this.setState({ loading: false });
      };

      setTimeout(time, 1500);
    }
  };

  componentDidMount() {
    this.fetchWeather();
  }

  componentDidUpdate(pP, pS) {
    if (this.state.location !== pS.location && this.state.location.length > 2) {
      this.fetchWeather();
    }
  }

  render() {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div
          className="weather-box p-5 col-11 d-flex flex-column justify-content-center align-items-center"
          style={{ minWidth: "fit-content", maxWidth: "1200px" }}
        >
          <h1
            className="text-center"
            style={{
              textTransform: "uppercase",
              fontSize: "4.8rem",
              fontWeight: "400",
              letterSpacing: "2px",
              textOverflow: "ellipsis",
            }}
          >
            Classy Weather
          </h1>
          <input
            className="col-10 col-sm-4 text-center p-4 my-3"
            style={{
              backgroundColor: "#f0d2ce",
              border: "none",
              fontSize: "17px",
              fontFamily: "serif",
            }}
            type="text"
            placeholder="SEARCH FROM LOCATION"
            value={this.state.location}
            onChange={(e) => this.setState({ location: e.target.value })}
          />
          {this.state.loading ? (
            <span class="loader my-5"></span>
          ) : !this.state.location ? null : (
            <div className="d-flex flex-column flex-wrap gap-5 justify-content-center">
              <Weather
                key={{}}
                weather={this.state.weather}
                city={this.state.city}
                flag={this.state.flag}
              ></Weather>
            </div>
          )}
        </div>
      </div>
    );
  }
}

class Weather extends React.Component {
  render() {
    const {
      temperature_2m_min: min,
      temperature_2m_max: max,
      time: date,
      weather_code: code,
    } = this.props.weather;

    if (!this.props.weather) return;

    return (
      <>
        <h1
          className="text-center d-flex justify-content-center align-items-center gap-4 flex-wrap"
          style={{
            textTransform: "uppercase",
            fontFamily: "Cinzel",
            fontSize: "2.5rem",
            fontWeight: "700",
            letterSpacing: "2px",
            textOverflow: "ellipsis",
          }}
        >
          weather {this.props.city}
          <img
            src={`https://flagcdn.com/32x24/${this.props.flag}.png`}
            alt=""
            width={"30px"}
          />
        </h1>
        <div className="d-flex gap-5 justify-content-center flex-wrap">
          {date.map((e, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.8, duration: 2 }}
              key={i}
              className="px-5 py-4 d-flex flex-column gap-3 align-items-center flex-sm-grow-0 flex-grow-1"
              style={{
                backgroundColor: "#f0d2ce",
              }}
            >
              <h1 className="m-0 text-center" style={{ fontSize: "60px" }}>
                {icon(code.at(i))}
              </h1>
              <p className="m-0" style={{ fontSize: "20px" }}>
                {i === 0 ? "today" : String(new Date(date.at(i))).slice(0, 3)}
              </p>
              <p className="m-0" style={{ fontSize: "20px" }}>
                {Math.ceil(min.at(i))}° — <b>{Math.ceil(max.at(i))}°</b>
              </p>
            </motion.div>
          ))}
        </div>
      </>
    );
  }
}

export default App;
