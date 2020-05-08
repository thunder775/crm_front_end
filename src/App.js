import React from 'react';
import './App.css';
import EnquiryForm from "./components/enquiry_form";
import LoginForm from "./components/login_page";
import {BrowserRouter as Router, Link, Switch, Route} from "react-router-dom";


function App() {
    return (
        <div className="App">
            <header className="App-header">
                <Router>
                    <Switch>
                        {/*<Route path={"/search"} component={SearchPage}/>*/}
                        <Route path={"/customers"} component={EnquiryForm}/>
                        <Route exact path={""} component={LoginForm}/>
                    </Switch>
                </Router>
            </header>
        </div>


    );
}

export default App;
