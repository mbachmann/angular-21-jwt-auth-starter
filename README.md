# Angular 21 JWT Authentication & Authorization example with Rest API (standalone)

- Backend: https://github.com/mbachmann/spring-boot-3-starter-security.git
- Frontend: https://github.com/mbachmann/angular-21-jwt-auth-starter.git

Build Angular 21 JWT Authentication & Authorization example with Rest Api, HttpOnly Cookie and JWT (including HttpInterceptor, Router & Form Validation).
- JWT Authentication Flow for User Registration (Signup) & User Login
- Project Structure with HttpInterceptor, Router
- Way to implement HttpInterceptor
- How to store JWT token in HttpOnly Cookie
- Creating Login, Signup Components with Form Validation
- Angular Components for accessing protected Resources
- How to add a dynamic Navigation Bar to Angular App
- How to protect Routes with AuthGuard
- How to implement User Logout

## Flow for User Registration and User Login
For JWT – Token-based Authentication with Rest API,  3 endpoints:
- POST `api/auth/signup` for User Registration
- POST `api/auth/signin` for User Login
- POST `api/auth/signout` for User Logout

## Verify JWT Authentication & Authorization

- GET `api/test/user` for User
- GET `api/test/mod` for Moderator
- GET `api/test/admin` for Admin
- GET `api/test/all` for Public

## Create a Docker Container, Run and Publish to Docker

Replace **uportal** with your **dockerhub id** in the script files build.sh and build-arm.sh.

**For intel architecture:**

A preconfigured shell script includes the build command:

```shell
./build.sh
```

**For arm64v8 architecture (e.g. MAC Mx):** [https://hub.docker.com/r/arm64v8/nginx/](https://hub.docker.com/r/arm64v8/nginx/)

A preconfigured shell script includes the build command:

```shell
./build-arm.sh
```

```
$  docker login
$  docker login --username uportal --password
$  docker push uportal/angular-21-jwt-auth
```

<br/>

Alternative way for login:

```
cat ~/.key/my_password.txt | docker login --username uportal --password-stdin
```

## Target Deployment Platform (Linux, Mac, Windows)

Login to deployment platform with a container infrastructure:

<br/>

Replace **uportal** with your **dockerhub id**.

<br/>

```
$  docker pull uportal/angular-21-jwt-auth
```

<br/>

### Run the app with a docker-compose file

Start the App in detached mode with:

```
$  docker compose up -d
```

<br/>

Start the App with log output in the console:

```
$  docker compose up
```

or with specific docker-compose file (e.g. on linux with a traefik reverse proxy)

```
$  docker compose -f docker-compose-traefik-v3.yml up
```

<br/>

Delete containers:

```
$  docker compose rm
$  docker compose -f docker-compose-traefik-v3.yml rm
```



