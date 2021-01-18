const axios = require('axios');
const config = require('../config');

async function request_call(url) {
    const options = {
        baseURL: config.baseURL,
        url: url,
        method: 'GET',
        auth: {
            username: config.username,
            password: config.password
        }  
    }
    
    try{
        const response = await axios(options);
        return response.data;
    } catch(error){
        return error.data;
    }
};

module.exports.request_call = request_call;
