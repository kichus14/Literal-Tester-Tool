const express = require('express');
const router =  express .Router();
const config = require('../../config');
const requstCall = require('../../shared/util');

router.post('/', async (req, resp, next)=>{
    console.log(req.body.repokey);
    let url = (config.branchUrlPath).replace(/KEY/g, `${req.body.key}`).replace(/reposlug/g, `${req.body.repokey}`);
    console.log(url);
    try {
        let responseData = await requstCall.request_call(url);
        resp.send(responseData);  
    } catch (error){
        resp.send(error);
        next(error);
        
    }
});

module.exports = router;
