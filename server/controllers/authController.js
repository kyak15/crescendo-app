import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { promisify } from 'util';
import pool from '../db.js';


const secret = process.env.JWTSECRET || 'testsecret'
const expires = process.env.JWTEXPIRES || 1000 * 60 * 60

const checkEmailExists = async(email)=>{
    
    const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    
    if(emailCheck.rows.length>0){ 
        return true
    }
    return false
}


const checkUserNameExists = async(name)=>{
    const nameCheck = await pool.query('SELECT * FROM users WHERE userName = $1', [name])
    if(nameCheck.rows.length > 0){
        return true
    }
    return false
}

const signUp = async(req,res)=>{

    const {userName, email, password} = req.body;
    const emailExists = await checkEmailExists(email)
    const userNameExists = await checkUserNameExists(userName)

    if(emailExists){
        return res.json({
            status: 409,
            message: 'This Email already Exists'
        })
        
    }
    if(userNameExists){
        return res.json({
            status: 409,
            message: 'This User Already Exists'
        })
    }

    //generete new pass
    const saltRound = 12
    const salt = await bcrypt.genSalt(saltRound)
    const bcryptPassword = await bcrypt.hash(password, salt)

    await pool.query('INSERT INTO users (email, userName, password) VALUES ($1,$2,$3)',[email, userName, bcryptPassword])
    

    //create new token
    const token = jwt.sign({userName: userName}, secret, {
        expiresIn: expires
    })        


/**
 *     res.cookie('token', token,{
        httpOnly: true,
        secure: false, //!this should be changed to true when in production, fine as false in dev
        maxAge: 1000*60*60
    })
 * 
 */

    res.cookie('token', token, {
        httpOnly: true,
        secure: false, //!this should be changed to true when in production, fine as false in dev
        maxAge: 1000*60*60
    });

    

    
    return res.json({
        status: 201,
        userName
    })

    
}

const logIn = async(req,res)=>{

    const {email, password} = req.body;
    const userExists = await checkEmailExists(email)

    if (!userExists){
        return res.json({
            status: 409,
            message: 'This Username Does Not Exist!'
        })
    }

    const dbSearch = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const dbPass = dbSearch.rows[0].password
    const passTest = await bcrypt.compare(password, dbPass)

    if(!passTest){
        return res.json({
            status: 401,
            message: 'Invalid Password!'
        })
    }

    const userName = dbSearch.rows[0].username
    const token = jwt.sign({userName: userName}, secret, {
        expiresIn: expires
    })        
    res.cookie('token', token, {
        httpOnly: true,
        secure: false, //!this should be changed to true when in production, fine as false in dev
        maxAge: 1000*60*60
    });


    
    return res.json({
        status: 200,
        userName
    })

    
}

const logOut = async(req,res)=>{

    if(req.cookies.token){
        res.clearCookie('token')
        return res.json({status:200})
    }

}

//middleware that runs to verify users
    // Basically checking if a session currently exists and if that session has a JWT with it 
const restricted = async(req,res,next)=>{
        
    if(!req.cookies || !req.cookies.token){
        return res.json({
            status: 401,
            mesage: 'User is Not Authorized'
        })
           
    }

    const token = req.cookies.token
    const decodedToken = await promisify(jwt.verify)(token, secret)
    const userName = decodedToken.userName
    const userExists = checkUserNameExists(userName)
    
    if (!userExists){
        return res.json({
            status: 409,
            message: 'User does Not Exist'
        })
        
    }
  
    res.locals.user = userName
    next()
}

//Purpose: Check if a user has valid cookie activated and return their userName
const isAuth = async(req,res)=>{
    
    const authToken = req.cookies.token
    if(!authToken) return res.json({status:500, message: 'User Not Logged In'})

    const decodedToken = await promisify(jwt.verify)(authToken, secret)
    const userName = decodedToken.userName
    return res.json({
        status: 200,
        userName
    })
}


export {signUp, logIn, logOut, restricted, isAuth};