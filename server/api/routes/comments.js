const express = require('express');
const router =  express .Router();
const config = require('../../config');
const requstCall = require('../../shared/util');

router.post('/', async (req, resp, next)=>{
    let url = (config.commentUrlPath).replace(/KEY/g, `${req.body.key}`).replace(/NAME/g, `${req.body.name}`).replace(/ID/g, `${req.body.id}`);

    try {
        let responseData = await requstCall.request_call(url);
        resp.json({
                data: responseData,
                detail:config.prqDeatils
        }); 
    } catch (error){
        next(error);
    }
});

module.exports = router;
