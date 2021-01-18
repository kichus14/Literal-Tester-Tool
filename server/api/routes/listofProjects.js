const express = require('express');
const router =  express .Router();
const config = require('../../config');
const requstCall = require('../../shared/util');

router.get('/', async (req, resp, next)=>{
    try {
        let data = await requstCall.request_call(config.projectListUrlPath, '');
        resp.send(data);  
    } catch (error){
        next(error);
    }
});

module.exports = router;