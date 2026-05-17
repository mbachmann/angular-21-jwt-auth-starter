### STAGE 1: Build ###

# We label our stage as 'builder'
FROM node:22-alpine AS builder

RUN apk add --no-cache python3 g++ make

COPY package.json package-lock.json ./

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm ci && mkdir /ng-app && mv ./node_modules ./ng-app/

## Move to /ng-app (eq: cd /ng-app)
WORKDIR /ng-app

# Copy everything from host to /ng-app in the container
COPY . .
ARG configuration=production
## Build the angular app in production mode and store the artifacts in dist folder
ARG NG_ENV=production
RUN npm run build

### STAGE 2: Setup ###

FROM nginx:1.27.4-alpine

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## Copy script used to inject environment variables into the project
COPY start.sh /usr/share/nginx/start.sh

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /ng-app/dist/angular-21-jwt-auth/browser /usr/share/nginx/html

# Fix permissions for runtime
RUN chmod 777 /var/log/nginx /usr/share/nginx/html
RUN sed -i 's/\r$//' /usr/share/nginx/start.sh
RUN chmod +x /usr/share/nginx/start.sh

EXPOSE 80

## Inject environment variables into the project

## CMD /usr/share/nginx/start.sh
CMD ["sh", "/usr/share/nginx/start.sh"]
