const express = require('express');
const router =  express .Router();
const config = require('../../config');
const requstCall = require('../../shared/util');

router.post('/', async (req, resp, next)=>{
    
    let url = (config.pullRequestUrlPath).replace(/KEY/g, `${req.body.key}`).replace(/NAME/g, `${req.body.name}`).replace(/STATUS/g, `${req.body.status}`);
    
    try {
        config.prqDeatils = [];
        let responseData = await requstCall.request_call(url);
        responseData.values.map((data)=>{
                config.prqDeatils.push(
                    {
                        id: data.id,
                        name : data.author.user.displayName,
                        screenName: data.title
                    }
                )
            } );
        resp.send(responseData);  
    } catch (error){
        next(error);
    }
});

module.exports = router;
