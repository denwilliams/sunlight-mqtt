# sunlight-mqtt

Emit over MQTT when sunlight phases change (using SunCalc)

## Topics

Emits `prefix/night` and `prefix/dark` with data `{"value": true/false}` where prefix is set in config.

## Running

Install `npm i -g sunlight-mqtt`

Create a YAML file somewhere. See `config.example.yml`

Run (replace path)

```
CONFIG_PATH=./config.yml sunlight-mqtt
```

## Example Config

```
mqtt:
  uri: mqtt://localhost
  prefix: sunlight/
service:
  latitude: -37.814
  longitude: 144.96332
```

## HTTP Status Endpoint

Add port to config:

```
mqtt:
  uri: mqtt://localhost
  prefix: sunlight/
http:
  port: 9876
service:
  latitude: -37.814
  longitude: 144.96332
```

Then request `http://localhost:9876/status`

Metrics coming soon.
