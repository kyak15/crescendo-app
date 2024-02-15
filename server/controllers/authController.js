import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
//import { promisify } from 'util';
import pool from '../db.js'

const secret = process.env.JWTSECRET || 'testsecret'
const expires = process.env.JWTEXPIRES || 1000 * 60 * 60

const checkUserExists = async(name, email)=>{
    const userNameCheck = await pool.query('SELECT * FROM users WHERE userName = $1', [name])
    const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if(userNameCheck.rows.length > 0){
        return false
    }
    if(emailCheck.rows.length>0){
        return false
    }

    return true
}

const signUp = async(req,res)=>{
    console.log('sign')
    try {
        const {userName, email, password} = req.body;
        const userExists = await checkUserExists(userName, email)
        if(!userExists){
            throw new Error('Email or username already exists. Please enter a new one')
        }

        //generete new pass
        const saltRound = 12
        const salt = await bcrypt.genSalt(saltRound)
        const bcryptPassword = await bcrypt.hash(password, salt)
        
        //insert into db
        const newUserInfo = await pool.query(
            'INSERT INTO users (userName, email, password) VALUES ($1,$2,$3) RETURNING *'
            ,[userName, email, bcryptPassword])
        
        if(newUserInfo.rows.length <1){
            throw new Error('User not added. Issue with Database')
        }

        //create new token
        const token = jwt.sign({userID: newUserInfo.userID}, secret, {
            expiresIn: expires
        })        

        //create session 
  
        req.session.token = token 
        res.json({
            status: 201
        })

    } catch (error) {
        console.log(error)
        return res.json({
            status: 500,
            message: error.message
        })
    
    }
}

const logIn = async(req,res)=>{


    //TODO need to refine getting the userID from the database to lower the lines of code

    try {
        const {userName, password} = req.body;
        const userExists = checkUserExists(userName)
        if (!userExists){
            throw new Error('User does not exist!')
        }
        const dbSearch = await pool.query('SELECT password FROM users WHERE userName = $1', [userName])
        const dbPass = dbSearch.rows[0]
        const passTest = await bcrypt.compare(password, dbPass.password)
        if(!passTest){
            throw new Error('Invalid Password')
        }
        const userID = await pool.query('SELECT userID FROM users WHERE userName = $1', [userName])
        const token = jwt.sign({userID: userID}, secret, {
            expiresIn: expires
        })        
        req.session.token = token

        res.json({
            status: 200
        })
    } catch (error) {
        console.log(error)
        return res.json({
            status:500,
            message: error.message
        })   
    }
}

const logOut = async(req,res)=>{
    req.session.destroy(err =>{
        if(err){
            console.log(err)
            return res.json({status: 500})
        }else{
            res.clearCookie('cookie')
            res.json({
                status:200
            })
        }
    })

}

//middleware that runs to verify users
const restricted = (req,res,next)=>{
    if(!req.session || !req.session.token){
        return res.json({
            status: 500,
            message: 'User is not logged/signed in'
        })
    }
    next()
}


export {signUp, logIn, logOut, restricted};