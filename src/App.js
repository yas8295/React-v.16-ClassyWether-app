import React from "react";
import { motion } from "framer-motion";

function icon(code) {
  const icons = new Map([
    [[0], "☀️"],
    [[1], "🌤"],
    [[2], "⛅️"],
    [[3], "☁️"],
    [[45, 48], "🌫"],
    [[51, 56, 61, 66, 80], "🌦"],
    [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
    [[71, 73, 75, 77, 85, 86], "🌨"],
    [[95], "🌩"],
    [[96, 99], "⛈"],
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
    code: 0,
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
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,sunshine_duration&timezone=auto`
      );
      const weatherData = await weatherRes.json();
      this.setState({ code: weatherData.daily.weather_code[0] });

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
    const myImage = require(`./images/${this.state.code}.jpg`);

    return (
      <div
        className="d-flex justify-content-center align-items-center position-relative"
        style={{
          minHeight: "100vh",
        }}
      >
        <div
          className="position-absolute"
          style={{
            zIndex: 0,
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            backgroundImage: `linear-gradient(rgba(36, 42, 46, 0.4), rgb(64 65 65 / 40%)),url(${myImage})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        ></div>
        <div
          className="weather-box p-5 col-11 d-flex flex-column justify-content-center align-items-center"
          style={{ minWidth: "fit-content", maxWidth: "1200px", zIndex: 100 }}
        >
          <h1
            className="text-center"
            style={{
              textTransform: "uppercase",
              fontSize: "4.8rem",
              fontWeight: "400",
              letterSpacing: "2px",
              textOverflow: "ellipsis",
              color: "white",
            }}
          >
            Classy Weather
          </h1>
          <input
            className="col-12 col-sm-4 text-center p-4 my-3"
            style={{
              backgroundColor: "white",
              border: "5px solid #55a4ff",
              fontSize: "22px",
              fontFamily: "serif",
              borderRadius: "10px",
              opacity: 0.8,
              transition: "0.5s",
            }}
            type="text"
            placeholder="SEARCH FROM LOCATION"
            value={this.state.location.toUpperCase()}
            onChange={(e) => this.setState({ location: e.target.value })}
          />
          {this.state.loading ? (
            <div class="container">
              <div class="cloud front">
                <span class="left-front"></span>
                <span class="right-front"></span>
              </div>
              <span class="sun sunshine"></span>
              <span class="sun"></span>
              <div class="cloud back">
                <span class="left-back"></span>
                <span class="right-back"></span>
              </div>
            </div>
          ) : !this.state.location ? null : (
            <div className="d-flex flex-column flex-wrap gap-5 justify-content-center">
              <Weather
                key={{}}
                weather={this.state.weather}
                city={this.state.city}
                flag={this.state.flag}
                color={this.state.code}
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
      sunrise,
      sunset,
    } = this.props.weather;

    if (!this.props.weather) return;

    return (
      <>
        <h1
          className="text-center d-flex justify-content-center align-items-center gap-4 flex-wrap"
          style={{
            textTransform: "uppercase",
            fontFamily: "Cinzel",
            fontSize: "35px",
            fontWeight: "700",
            letterSpacing: "2px",
            textOverflow: "ellipsis",
            color: "white",
          }}
        >
          weather {this.props.city}
          <img
            src={`https://flagcdn.com/32x24/${this.props.flag}.png`}
            alt=""
            width={"40px"}
          />
        </h1>
        <div className="d-flex gap-5 justify-content-center flex-wrap">
          {date.map((e, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.8, duration: 2 }}
              whileHover={{ y: -20 }}
              key={i}
              className="px-5 py-4 d-flex flex-column gap-3 align-items-center flex-sm-grow-0 flex-grow-1"
              style={{
                background: `${
                  this.props.color === 0 ||
                  this.props.color === 1 ||
                  this.props.color === 2 ||
                  this.props.color === 3
                    ? "linear-gradient(109deg, rgba(255,255,255,1) 26%, rgba(229,229,229,1) 55%, rgba(0,167,255,0.4647897244835434) 100%)"
                    : "linear-gradient(109deg, rgba(0,0,0,1) 0%, rgba(119,181,225,0.9773947665003502) 88%)"
                }`,
                borderRadius: "10px",
                minWidth: "200px",
              }}
            >
              <h1
                className="m-0 text-center"
                style={{
                  fontSize: "70px",
                  color: `${
                    this.props.color === 0 ||
                    this.props.color === 1 ||
                    this.props.color === 2 ||
                    this.props.color === 3
                      ? "black"
                      : "white"
                  }`,
                }}
              >
                {icon(code.at(i))}
              </h1>
              <p
                className="m-0"
                style={{
                  fontSize: "25px",
                  color: `${
                    this.props.color === 0 ||
                    this.props.color === 1 ||
                    this.props.color === 2 ||
                    this.props.color === 3
                      ? "black"
                      : "white"
                  }`,
                }}
              >
                {i === 0 ? "today" : String(new Date(date.at(i))).slice(0, 3)}
              </p>
              <p
                className="m-0"
                style={{
                  fontSize: "25px",
                  color: `${
                    this.props.color === 0 ||
                    this.props.color === 1 ||
                    this.props.color === 2 ||
                    this.props.color === 3
                      ? "black"
                      : "white"
                  }`,
                }}
              >
                {Math.ceil(min.at(i))}° — <b>{Math.ceil(max.at(i))}°</b>
              </p>
              <p
                className="m-0"
                style={{
                  fontSize: "25px",
                  color: `${
                    this.props.color === 0 ||
                    this.props.color === 1 ||
                    this.props.color === 2 ||
                    this.props.color === 3
                      ? "black"
                      : "white"
                  }`,
                  fontFamily: "initial",
                }}
              >
                ☀️ {sunrise[i].slice(-5)}
              </p>
              <p
                className="m-0"
                style={{
                  fontSize: "25px",
                  color: `${
                    this.props.color === 0 ||
                    this.props.color === 1 ||
                    this.props.color === 2 ||
                    this.props.color === 3
                      ? "black"
                      : "white"
                  }`,
                  fontFamily: "initial",
                }}
              >
                🌙 {sunset[i].slice(-5)}
              </p>
            </motion.div>
          ))}
        </div>
      </>
    );
  }
}

export default App;
