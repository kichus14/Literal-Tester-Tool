import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Header from './components/Header';
import LiteralTester from './components/LiteralTester';
import ListofRepositories from './components/ListofRepositories';
import ListofPullRequest from './components/ListofPullRequest';
import Comments from './components/Comments';

function App() {
  return (
    <div className="App" >
      <Header />
      <main role="main">
        <div className="container cnt-hgt">
          <Router>
            <Switch>
              <Route path="/" component={LiteralTester} exact />
            </Switch>
          </Router>
        </div>
      </main>
      <footer class="text-muted">
        <div class="container">
          <p class="float-right">
            <a href="#">Back to top</a>
          </p>
          <p>Footer</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
