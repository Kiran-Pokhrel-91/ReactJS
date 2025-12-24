const Weather = ({ temprature }) => {
  const message = "Temprature";
  if (temprature < 15) {
    return <p>{message}: It's Cold Outside</p>;
  } else if (temprature >= 15 && temprature <= 25) {
    return <p>{message}: It's Nice Outside</p>;
  } else {
    return <p>{message}: It's Hot Outside</p>;
  }
};

export default Weather;
