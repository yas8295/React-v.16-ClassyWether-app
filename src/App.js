import React from "react";
import { motion } from "framer-motion";
import { WiMoonWaningCrescent3 } from "react-icons/wi";
import sunny from "./images/klipartz.com.png";
import rainy from "./images/Download Free Mobile Phone Screensaver Wet Screen - 187 - MobileSMSPK_net.gif";
import snowy from "./images/snowflakes-background-barcin.jpg";
import { WiHorizonAlt } from "react-icons/wi";
import { WiDaySunny } from "react-icons/wi";
import { WiDayCloudy } from "react-icons/wi";
import { WiDayFog } from "react-icons/wi";
import { WiRain } from "react-icons/wi";
import { WiShowers } from "react-icons/wi";
import { WiSnowWind } from "react-icons/wi";
import { WiStormShowers } from "react-icons/wi";
import { WiThermometer } from "react-icons/wi";
import { WiCloudy } from "react-icons/wi";

function icon(code) {
  const icons = new Map([
    [[0], <WiDaySunny />],
    [[1, 2], <WiDayCloudy />],
    [[3], <WiCloudy />],
    [[45, 48], <WiDayFog />],
    [[51, 56, 61, 66, 80], <WiRain />],
    [[53, 55, 63, 65, 57, 67, 81, 82], <WiShowers />],
    [[71, 73, 75, 77, 85, 86], <WiSnowWind />],
    [[95, 96, 99], <WiStormShowers />],
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
          className="position-fixed"
          style={{
            zIndex: 0,
            width: "100vw",
            minHeight: "100vh",
            top: 0,
            left: 0,
            backgroundImage: `linear-gradient(rgba(36, 42, 46, 0.4), rgb(64 65 65 / 40%)),url(${myImage})`,
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
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
            className="col-8 col-sm-4 text-center p-4 my-3 align-self-center"
            style={{
              backgroundColor: "white",
              border: "5px solid #55a4ff",
              fontSize: "22px",
              fontFamily: "serif",
              borderRadius: "10px",
              opacity: 0.8,
              transition: "0.5s",
              maxWidth: "85%",
            }}
            type="text"
            placeholder="SEARCH FROM LOCATION"
            value={this.state.location.toUpperCase()}
            onChange={(e) => this.setState({ location: e.target.value })}
          />
          {this.state.loading ? (
            <div className="container">
              <div className="cloud front">
                <span className="left-front"></span>
                <span className="right-front"></span>
              </div>
              <span className="sun sunshine"></span>
              <span className="sun"></span>
              <div className="cloud back">
                <span className="left-back"></span>
                <span className="right-back"></span>
              </div>
            </div>
          ) : !this.state.location ? null : (
            <div className="d-flex flex-column flex-wrap gap-5 justify-content-center">
              <Weather
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
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              key={i}
              className="px-5 py-4 d-flex flex-column gap-3 align-items-center flex-sm-grow-0 flex-grow-1 position-relative"
              style={{
                background: `${
                  this.props.color === 0 ||
                  this.props.color === 1 ||
                  this.props.color === 2 ||
                  this.props.color === 3 ||
                  this.props.color === 45 ||
                  this.props.color === 48
                    ? "linear-gradient(181deg, rgb(255 255 255 / 32%) 26%, rgba(229, 229, 229, 0.97) 55%, rgb(255 255 255) 100%)"
                    : "linear-gradient(109deg, rgb(0 0 0 / 58%) 0%, rgb(119 181 225 / 91%) 88%)"
                }`,
                borderRadius: "10px",
                minWidth: "250px",
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.7 }}
                transition={{ duration: 4 }}
                className="h-100 w-100 position-absolute"
                style={{ left: 0, top: 0, borderRadius: "10px", zIndex: -1 }}
              >
                <img
                  style={{ borderRadius: "10px" }}
                  src={`${
                    this.props.color === 0 ||
                    this.props.color === 1 ||
                    this.props.color === 2 ||
                    this.props.color === 3 ||
                    this.props.color === 45 ||
                    this.props.color === 48
                      ? sunny
                      : this.props.color === 71 ||
                        this.props.color === 73 ||
                        this.props.color === 75 ||
                        this.props.color === 77 ||
                        this.props.color === 85 ||
                        this.props.color === 86
                      ? snowy
                      : rainy
                  }`}
                  alt=""
                  width="100%"
                  height="100%"
                />
              </motion.div>
              <h1
                className="m-0 text-center d-flex align-items-center justify-content-center "
                style={{
                  fontSize: "80px",
                  color: `${
                    this.props.color === 0 ||
                    this.props.color === 1 ||
                    this.props.color === 2 ||
                    this.props.color === 3 ||
                    this.props.color === 45 ||
                    this.props.color === 48
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
                    this.props.color === 3 ||
                    this.props.color === 45 ||
                    this.props.color === 48
                      ? "black"
                      : "white"
                  }`,
                }}
              >
                {i === 0 ? "today" : String(new Date(date.at(i))).slice(0, 3)}
              </p>
              <p
                className="m-0 d-flex align-items-center"
                style={{
                  fontSize: "25px",
                  color: `${
                    this.props.color === 0 ||
                    this.props.color === 1 ||
                    this.props.color === 2 ||
                    this.props.color === 3 ||
                    this.props.color === 45 ||
                    this.props.color === 48
                      ? "black"
                      : "white"
                  }`,
                }}
              >
                <WiThermometer></WiThermometer>
                {Math.ceil(min.at(i))}° — <b>{Math.ceil(max.at(i))}°</b>
              </p>
              <p
                className="m-0 d-flex align-items-center gap-2"
                style={{
                  fontSize: "25px",
                  color: `${
                    this.props.color === 0 ||
                    this.props.color === 1 ||
                    this.props.color === 2 ||
                    this.props.color === 3 ||
                    this.props.color === 45 ||
                    this.props.color === 48
                      ? "black"
                      : "white"
                  }`,
                  fontFamily: "initial",
                }}
              >
                <WiHorizonAlt />
                {sunrise[i].slice(-5)}
              </p>
              <div
                className="m-0 d-flex align-items-center"
                style={{
                  fontSize: "25px",
                  color: `${
                    this.props.color === 0 ||
                    this.props.color === 1 ||
                    this.props.color === 2 ||
                    this.props.color === 3 ||
                    this.props.color === 45 ||
                    this.props.color === 48
                      ? "black"
                      : "white"
                  }`,
                  fontFamily: "initial",
                }}
              >
                <WiMoonWaningCrescent3 />
                {sunset[i].slice(-5)}
              </div>
            </motion.div>
          ))}
        </div>
      </>
    );
  }
}

export default App;
