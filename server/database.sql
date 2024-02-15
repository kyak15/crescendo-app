--DB convention ALL CAPS
--Table convention: PascaleCase
--traits convention: camelCase

CREATE DATABASE CRESCENDO;

CREATE TABLE Users(
    userID SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE FavFive(
    favID SERIAL PRIMARY KEY,
    userID INTEGER REFERENCES users(userID) ON DELETE CASCADE,
    albumName VARCHAR(255) NOT NULL
);

CREATE TABLE ListenList(
    listenID SERIAL PRIMARY KEY,
    userID INTEGER REFERENCES users(userID) on DELETE CASCADE,
    albumName VARCHAR(255) NOT NULL
);

CREATE TABLE Reviews(
    reviewID SERIAL PRIMARY KEY,
    userID INTEGER REFERENCES users(userID) on DELETE CASCADE,
    albumName VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL,
    desc VARCHAR(255),
    addedDATE DATE NOT NULL
);

-- may need to tweak this upon implementation
-- need to look into how we would get user id from client side to adding to db 
CREATE TABLE Following(
    followID SERIAL PRIMARY KEY,
    userID INTEGER REFERENCES users(userID) on DELETE CASCADE,
    followerID INTEGER REFERENCES users(userID)
);