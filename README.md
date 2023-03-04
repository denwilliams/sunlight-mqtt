# sunlight-mqtt

Emit over MQTT when sunlight phases change (using SunCalc)

**Breaking: v2.0 now emits `true`/`false` instead of {"value":true}/{"value":false} on night/dark events**

## Topics

Emits `{prefix}/night` and `{prefix}/dark` with data `true`/`false` where prefix is set in config.

Emits the current position of the sun every minute `{prefix}/position` with data `{"azimuth": 0, "altitude": 0}` where prefix is set in config. See suncalc for the values. You can also listen to `{prefix}/azimuth` and `{prefix}/altitude` for the individual values.

Beta: Emits `{prefix}/phase` with data `"sunrise"` `"sunriseEnd"` etc where prefix is set in config and values can be found on suncalc. The phase value emitted is the most recent phase entered.

## Running

It is intended to be installed globally, ie `npm i -g sunlight-mqtt`

Create a YAML file somewhere. See `config.example.yml`

Run (replace path)

```
CONFIG_PATH=./config.yml sunlight-mqtt
```

You can also use Consul for config. See [mqtt-usvc](https://www.npmjs.com/package/mqtt-usvc) for more details.

## Example Config

```
mqtt:
  uri: mqtt://localhost
  prefix: sunlight
service:
  latitude: -37.814
  longitude: 144.96332
```

## HTTP Status Endpoint

Add port to config:

```
mqtt:
  uri: mqtt://localhost
  prefix: sunlight
http:
  port: 9876
service:
  latitude: -37.814
  longitude: 144.96332
```

Then request `http://localhost:9876/status`

Metrics coming soon.
