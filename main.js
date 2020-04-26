#!/usr/bin/env node

const suncalc = require("suncalc");
const mqttusvc = require("mqtt-usvc");

const nightState = {
  nadir: "night",
  nightEnd: "night",
  nauticalDawn: "night",
  dawn: "night",
  sunrise: "day",
  sunriseEnd: "day",
  goldenHourEnd: "day",
  solarNoon: "day",
  goldenHour: "day",
  sunsetStart: "day",
  sunset: "night",
  dusk: "night",
  nauticalDusk: "night",
  night: "night"
};

const darkState = {
  nadir: "dark",
  nightEnd: "dark",
  nauticalDawn: "dark",
  dawn: "dark",
  sunrise: "dark",
  sunriseEnd: "dark",
  goldenHourEnd: "light",
  solarNoon: "light",
  goldenHour: "dark",
  sunsetStart: "dark",
  sunset: "dark",
  dusk: "dark",
  nauticalDusk: "dark",
  night: "dark"
};

async function main() {
  const service = await mqttusvc.create();

  let lastNightState, lastDarkState;

  const handler = () => {
    const now = new Date();
    const times = suncalc.getTimes(
      now,
      service.config.latitude,
      service.config.longitude
    );

    const pastKeys = Object.keys(times)
      .sort((a, b) => times[a] - times[b])
      .filter(key => now > times[key]);

    const lastKey = pastKeys.length ? pastKeys[pastKeys.length - 1] : "night";

    const currentNightState = nightState[lastKey];
    const currentDarkState = darkState[lastKey];

    if (currentDarkState !== lastDarkState) {
      service.send(
        "dark",
        { value: currentDarkState === "dark" },
        { retain: true }
      );
      lastDarkState = currentDarkState;
    }

    if (currentNightState !== lastNightState) {
      service.send(
        "night",
        { value: currentNightState === "night" },
        { retain: true }
      );
      lastNightState = currentNightState;
    }
  };

  handler();

  // need to set this more intelligently
  setInterval(handler, 60000);
}

main().catch(err => {
  console.error(err.stack);
  process.exit(1);
});
