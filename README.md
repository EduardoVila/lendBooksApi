# Lend Books API

This project uses Node.js, TypeScript, TypeORM, Express.js, Jest.js, and Yup, the database used is SQLite, after clone this repo remember to setup the application.

This project have five features:

1º Create user (POST /users)
2º Show user details (GET /users/:id)
3º Create a book (POST /book)
4º Lend a book (PUT /book/lend)
4º Borrow a book (PUT /book/return)

## Instaling the required libs
```
  yarn install
```

## Setup the development enviroment

### First of all, create the file `database.sqlite` inside the database directory `src/database`

### After that, run the command to setup the database:
```
  yarn development-setup
```

## Setup the test enviroment

### First of all, create the file `test_database.sqlite` inside the database directory `src/database`

### After that, run the command to setup the database:
```
  yarn test-setup
```

## Running the development enviroment

The development enviroment must be accessed on `http://localhost:3333/`

### To start the development application run the command:
```
  yarn dev
```

## Running the test enviroment
```
  yarn test
```
