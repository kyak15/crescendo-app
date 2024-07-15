import {addFavorite, addListenList, addReview, deleteFavorite, deleteListenList, deleteReview, changeReview, getUserData } from '../controllers/userController'
import jest from 'jest-mock'
import pool from '../db'

const createUserQuery = 'CREATE TABLE Users( userID SERIAL PRIMARY KEY,email VARCHAR(255) UNIQUE NOT NULL, username VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL);'
const createFavFiveQuery = 'CREATE TABLE FavFive(favID SERIAL PRIMARY KEY, userName VARCHAR(255) REFERENCES users(userName) ON DELETE CASCADE, albumID VARCHAR(255) NOT NULL UNIQUE, artistID VARCHAR(255) NOT NULL,albumName VARCHAR(255) NOT NULL,artistName VARCHAR(255) NOT NULL,albumArt VARCHAR(255) NOT NULL);'
const createListenListQuery = 'CREATE TABLE ListenList(listenID SERIAL PRIMARY KEY, userName VARCHAR(255) REFERENCES users(userName) on DELETE CASCADE, albumID VARCHAR(255) NOT NULL UNIQUE, artistID VARCHAR(255) NOT NULL, albumName VARCHAR(255) NOT NULL, artistName VARCHAR(255) NOT NULL, albumArt VARCHAR(255) NOT NULL, addedData DATE NOT NULL);'
const createReviewsQuery = 'CREATE TABLE Reviews(reviewID SERIAL PRIMARY KEY, userName VARCHAR(255) REFERENCES users(userName) on DELETE CASCADE, albumID VARCHAR(255) NOT NULL, artistID VARCHAR(255) NOT NULL, albumName VARCHAR(255) NOT NULL, artistName VARCHAR(255) NOT NULL, albumArt VARCHAR(255) NOT NULL, rating INTEGER NOT NULL, userText VARCHAR(255), addedDate DATE NOT NULL);'



const initializeTestDatabase = async()=>{
    await pool.query(createUserQuery);
    await pool.query(createFavFiveQuery);
    await pool.query(createListenListQuery);
    await pool.query(createReviewsQuery);
    await pool.query('INSERT INTO Users (email, username, password) VALUES ($1, $2, $3)', ['test23@test', 'test23', 'test'])
}

const clearTestDatabase = async()=>{
    await pool.query('DROP Table if exists Users cascade;')
    await pool.query('DROP Table if exists FavFive cascade;')
    await pool.query('DROP Table if exists ListenList cascade;')
    await pool.query('DROP Table if exists Reviews cascade;')
}


beforeAll(()=>{
    return initializeTestDatabase();
})

afterAll(()=>{
    return clearTestDatabase();
})

const mockRequest = (body, locals)=>({
    body,
    locals
})



const mockResponse = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    return res;
  };
     
// Any tests using the database must create the tables, fill them, then delete them once the tests are completed 


// all tests from controllers occuring below 

describe('user controller testing', ()=>{

    test('successful favorite five addition', async()=>{
        const req = mockRequest(
            {
                albumID: 7,
                artistID: 'testArtistId',
                albumName: 'testAlbumName',
                artistName: 'testArtistName',
                albumArt: 'testAlbumArt'
            },
            
        );
        const res = mockResponse();
        res.locals = {
            user: 'test23'
        }
        
        const testData = await addFavorite(req, res) 
        
        expect(res.json).toHaveBeenCalledWith({
            status: 201,
            message: 'Album Added to Favorite Five!'
        })
    });

    test('error adding to Favorite Five', async()=>{
        const req = mockRequest(
            {
                albumID: 7,
                artistID: 'testArtistId',
                albumName: 'testAlbumName',
                artistName: 'testArtistName',
                albumArt: 'testAlbumArt'
            },
            
        );
        const res = mockResponse();
        res.locals = {
            user: 'test23'
        }
        const testData = await addFavorite(req, res) 
        
        expect(res.json).toHaveBeenCalledWith({
            status: 409,
            message: '5 favorite albums already exist or duplicate attempted'
        })
    })

    test('successful listen list addition', async()=>{
        const req = mockRequest({
            albumID: 4,
            artistID: 'Listen Test',
            albumName: 'ListenTest Name',
            artistName: 'Listen Artist Name',
            albumArt: 'testAlbumArt',
            date: '2024-07-09'
        })

        const res = mockResponse()
        res.locals = {
            user: 'test23'
        }
        await addListenList(req,res)

        expect(res.json).toHaveBeenCalledWith({
            status: 201,
            message: 'Album added to Listening List'
        })
    })

    test('Duplicate Album to Listen List', async()=>{
        const req = mockRequest({
            albumID: 4,
            artistID: 'Listen Test',
            albumName: 'ListenTest Name',
            artistName: 'Listen Artist Name',
            albumArt: 'testAlbumArt',
            date: '2024-07-09'
        })

        const res = mockResponse()
        res.locals = {
            user: 'test23'
        }
        await addListenList(req,res)

        expect(res.json).toHaveBeenCalledWith({
            status: 409,
            message: 'Album already exists in User Listen List'
        })

    })

    test('successful review addition', async()=>{
        const req = mockRequest({
            albumID: 4,
            artistID: 'Listen Test',
            albumName: 'ListenTest Name',
            artistName: 'Listen Artist Name',
            albumArt: 'testAlbumArt',
            rating: 5,
            text: 'test text',
            date: '2024-07-09'
        })
        const res = mockResponse()
        res.locals = {
            user: 'test23'
        }
        await addReview(req,res)

        expect(res.json).toHaveBeenCalledWith({
            status: 201,
            message: 'Review Submitted!'
        })
    })

    test('successful favorite five removal', async()=>{
        const req = mockRequest({
            albumName: 'testAlbumName'
        })

        const res = mockResponse()
        res.locals = {
            user: 'test23'
        }

        await deleteFavorite(req,res)
        expect(res.json).toHaveBeenCalledWith({
            status: 201,
            message: 'Album Removed from Favorite Five'
        })

    })

    test('successful listen list removal', async()=>{
        const req = mockRequest({
            albumName: 'ListenTest Name'
        })
        const res = mockResponse()
        res.locals = {
            user: 'test23'
        }
        await deleteListenList(req,res)
        expect(res.json).toHaveBeenCalledWith({
            status: 201,
            message:'album removed from listen list'
        })

    })

    test('successful review edit', async()=>{
        const req = mockRequest({
            albumName: 'ListenTest Name',
            rating: 3
        })
        const res = mockResponse()
        res.locals = {
            user: 'test23'
        }
        await changeReview(req,res)
        expect(res.json).toHaveBeenCalledWith({
            status: 201,
            message: 'Edited Review'
        })
    })
    
    test('successful review removal', async()=>{
        const req = mockRequest({
            albumName: 'ListenTest Name',
        })
        const res = mockResponse()
        res.locals = {
            user: 'test23'
        }
        await deleteReview(req,res)
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            message: 'Album review Deleted!'
        })
    })

})