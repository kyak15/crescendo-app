-- Check if the database exists
DO
$$
BEGIN
    -- Check if the database 'crescendo' exists
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'crescendo') THEN
        -- Create the database
        PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE crescendo');
    END IF;
END
$$;

-- Connect to the 'crescendo' database to create tables
\c crescendo


CREATE TABLE IF NOT EXISTS Users(
    userID SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);



CREATE TABLE IF NOT EXISTS FavFive(
    favID SERIAL PRIMARY KEY,
    userName VARCHAR(255) REFERENCES users(userName) ON DELETE CASCADE,
    albumID VARCHAR(255) NOT NULL UNIQUE,
    artistID VARCHAR(255) NOT NULL,
    albumName VARCHAR(255) NOT NULL,
    artistName VARCHAR(255) NOT NULL,
    albumArt VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS ListenList(
    listenID SERIAL PRIMARY KEY,
    userName VARCHAR(255) REFERENCES users(userName) on DELETE CASCADE,
    albumID VARCHAR(255) NOT NULL UNIQUE,
    artistID VARCHAR(255) NOT NULL,
    albumName VARCHAR(255) NOT NULL,
    artistName VARCHAR(255) NOT NULL,
    albumArt VARCHAR(255) NOT NULL,
    addedData DATE NOT NULL
);




CREATE TABLE IF NOT EXISTS Reviews(
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

CREATE TABLE IF NOT EXISTS Following(
    followID SERIAL PRIMARY KEY,
    userName VARCHAR(255) REFERENCES users(username) on DELETE CASCADE,
    followerUserName VARCHAR(255) REFERENCES users(username)
);