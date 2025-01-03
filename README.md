# Tracking system web app for a company

## RUN project on git workspace

### Make the Script Executable

Run the following command to add execute permissions:

```sh
chmod +x start_all.sh
```

Run the Script Again: After giving it execution permissions, run the script as before:

```sh
./start_all.sh
```

## RUN project on gitpod

### Make the Script Executable

Run the following command to add execute permissions:

```sh
chmod +x start_all_gitpod.sh
```

Run the Script Again: After giving it execution permissions, run the script as before:

```sh
./start_all_gitpod.sh
```

## Running the Project Using Docker

### 1.Backend Setup:

```sh

cd server/
cp .env.example .env
npm install
docker-compose up --build

```

### 2.Frontend Setup:

```sh

cd client/
cp .env.example .env
npm install
docker-compose up --build

```

## Running the Project Without Docker

### 1.Backend Setup:

```sh

cd server/
cp .env.example .env
npm install
npm start


```

### 2.Frontend Setup:

```sh

cd client/
cp .env.example .env
npm install
npm start


```

## Features:

- Projects CRUD
- Tickets CRUD
- Equipmnts CRUD
- Users CRUD
- Real time notification
