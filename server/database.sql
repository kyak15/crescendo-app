--DB convention ALL CAPS
--Table convention: PascaleCase
--traits convention: camelCase
--

CREATE DATABASE CRESCENDO;

CREATE TABLE Users(
    userID SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);



CREATE TABLE FavFive(
    favID SERIAL PRIMARY KEY,
    userName VARCHAR(255) REFERENCES users(userName) ON DELETE CASCADE,
    albumID VARCHAR(255) NOT NULL UNIQUE,
    artistID VARCHAR(255) NOT NULL,
    albumName VARCHAR(255) NOT NULL,
    artistName VARCHAR(255) NOT NULL,
    albumArt VARCHAR(255) NOT NULL
);

CREATE TABLE ListenList(
    listenID SERIAL PRIMARY KEY,
    userName VARCHAR(255) REFERENCES users(userName) on DELETE CASCADE,
    albumID VARCHAR(255) NOT NULL UNIQUE,
    artistID VARCHAR(255) NOT NULL,
    albumName VARCHAR(255) NOT NULL,
    artistName VARCHAR(255) NOT NULL,
    albumArt VARCHAR(255) NOT NULL,
    addedData DATE NOT NULL
);




CREATE TABLE Reviews(
    reviewID SERIAL PRIMARY KEY,
    userName VARCHAR(255) REFERENCES users(userName) on DELETE CASCADE,
    albumID VARCHAR(255) NOT NULL,
    artistID VARCHAR(255) NOT NULL,
    albumName VARCHAR(255) NOT NULL,
    artistName VARCHAR(255) NOT NULL,
    albumArt VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL,
    userText VARCHAR(255),
    addedDate DATE NOT NULL
);

CREATE TABLE Following(
    followID SERIAL PRIMARY KEY,
    userName VARCHAR(255) REFERENCES users(username) on DELETE CASCADE,
    followerUserName VARCHAR(255) REFERENCES users(username)
);