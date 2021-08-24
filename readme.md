# Zipcode microservice

This is a demo microservice that exposes both a graphql and a rest-like api for address completion of Japanese ZIP codes.


## Development
Install packages: `npm i` or `yarn i`

Then run locally:
```
npm run serve
```

Building docker
```
docker build -t japan-zipcode-microservice .
```

## Run via Docker

Run your locally built image with:
```
docker run --rm -p 3050:3050 japan-zipcode-microservice
```

Or run an image hosted on [dockerhub](https://hub.docker.com/r/cornelfh/japan-zipcode-microservice/tags)
```
docker run --rm -p 3050:3050 cornelfh/japan-zipcode-microservice:latest
```

## Testing
After running the application with npm or docker it is accessible at:
[`http://localhost:3050`](http://localhost:3050)