const express = require('express');
const app = express();
const cors = require('cors')
const morgan = require('morgan');
const bodyParser = require('body-parser');

const repositoriesRoutes = require('./api/routes/listofRepositories');
const requestRoutes = require('./api/routes/pullRequest');
const commentsRoutes = require('./api/routes/comments');
const projectsRoutes = require('./api/routes/listofProjects');
const branchesRoutes = require('./api/routes/listofbranches');
const literalsRoutes = require('./api/routes/readliterals');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

app.use('/repositoriesLists', repositoriesRoutes);
app.use('/browse', requestRoutes);
app.use('/comments', commentsRoutes);
app.use('/projects', projectsRoutes);
app.use('/branches', branchesRoutes);
app.use('/readliterals', literalsRoutes);

app.use((req, res, next)=>{
    const error = new Error('Not Found')
    error.status = 404;
    next(error)
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            messsage: error.messsage
        }
    })
})
module.exports = app;