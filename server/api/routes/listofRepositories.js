const express = require('express');
const router =  express .Router();
const config = require('../../config');
const requstCall = require('../../shared/util');

router.post('/', async (req, resp, next)=>{
    let url = (config.repositoriesUrlPath).replace(/KEY/g, `${req.body.key}`);

    try {
        let responseData = await requstCall.request_call(url);
        resp.send(responseData);  
    } catch (error){
        next(error);
    }
});

module.exports = router;
