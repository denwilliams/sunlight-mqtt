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
  night: "night",
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
  night: "dark",
};

async function main() {
  const service = await mqttusvc.create();

  let lastNightState, lastDarkState, lastPhase;

  const handler = () => {
    const now = new Date();
    const times = suncalc.getTimes(
      now,
      service.config.latitude,
      service.config.longitude
    );

    const pastKeys = Object.keys(times)
      .sort((a, b) => times[a] - times[b])
      .filter((key) => now > times[key]);

    const lastKey = pastKeys.length ? pastKeys[pastKeys.length - 1] : "night";

    const currentPhase = lastKey;
    const currentNightState = nightState[lastKey];
    const currentDarkState = darkState[lastKey];

    if (currentPhase !== lastPhase) {
      service.send("~/phase", { value: currentPhase }, { retain: true });
      lastPhase = currentPhase;
    }

    if (currentDarkState !== lastDarkState) {
      service.send("~/dark", currentDarkState === "dark", { retain: true });
      lastDarkState = currentDarkState;
    }

    if (currentNightState !== lastNightState) {
      service.send("~/night", currentNightState === "night", { retain: true });
      lastNightState = currentNightState;
    }

    const position = suncalc.getPosition(
      now,
      service.config.latitude,
      service.config.longitude
    );
    service.send("~/sun/position", position, { retain: true });
    service.send("~/sun/altitude", position.altitude, { retain: true });
    service.send("~/sun/azimuth", position.azimuth, { retain: true });
  };

  handler();

  setInterval(handler, 60000);
}

main().catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
