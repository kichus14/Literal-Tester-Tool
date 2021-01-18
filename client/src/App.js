import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Header from './components/Header';
import ListofProject from './components/ListofProject';
import ListofRepositories from './components/ListofRepositories';
import ListofPullRequest from './components/ListofPullRequest';
import Comments from './components/Comments';

function App() {
  return (
    <div className="App" >
      <Header/>
      <div className="container-fluid nopadding">
        <Router>
          <Switch>
            <Route path="/" component={ListofProject} exact />
            <Route path="/projects/:projectKey" component={ListofRepositories} />
            <Route path="/pull-request/:projectKey/:projectName" component={ListofPullRequest} />
            <Route path="/comments/:projectKey/:projectName/:id" component={Comments} />
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
