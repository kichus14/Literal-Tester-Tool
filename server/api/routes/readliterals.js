const express = require('express');
const router =  express .Router();
const config = require('../../config');
const requstCall = require('../../shared/util');

router.post('/', async (req, resp, next)=>{
    let url = (config.literalsUrlPath).replace(/KEY/g, `${req.body.key}`).replace(/reposlug/g, `${req.body.repokey}`).replace(/lang/g, `${req.body.lang}`).replace(/branchpath/g, `${req.body.branchPath}`).replace(/appRootPath/g, `${req.body.rootPath}`);
    try {
        let responseData = await requstCall.request_call(url);
        resp.send(responseData);  
    } catch (error){
        resp.send(error);
        next(error);
    }
});

module.exports = router;
