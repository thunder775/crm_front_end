import React, {useState} from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            user: '',
            password: '',
            sUser: '',
            sPassword: '',
            sCPassword: '',
            sUserError: false,
            sPasswordError: false,
            signingUp: false,
            loggingIn: false,
            signUpOutput: '',
            path: ''
        }

    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }


    render() {
        return (
            <div className={"login-header"}>
                <Paper className={'login-paper'}><Tabs value={this.state.index} onChange={(event, newValue) => {
                    this.setState({
                        index: newValue
                    })
                }} aria-label="simple tabs example">
                    <Tab label="Login"/>
                    <Tab label="SignUp"/>
                </Tabs>

                    <div hidden={this.state.index !== 0}>
                        <div className={"form-field"}>
                            <TextField label="Email or Username" name="user" variant="outlined" value={this.state.user}
                                       onChange={(event) => this.handleInputChange(event)}/>
                        </div>
                        <div className={"form-field"}>
                            <TextField label="Password" name="password" variant="outlined" value={this.state.password}

                                       onChange={(event) => this.handleInputChange(event)}/>
                        </div>
                        <Button variant="contained" color="secondary" onClick={async () => {
                            const requestOptions2 = {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                credentials: "include",
                                body: JSON.stringify({
                                    user: this.state.user,
                                    pwd: this.state.password
                                })
                            };
                            let result = await fetch('http://localhost:7007/login', requestOptions2);
                            console.log("status code from login" + result.status);
                            if(result.status==200){
                                this.props.history.push(`/customers`)
                            }
                        }}>Login
                        </Button>


                    </div>
                    <div hidden={this.state.index !== 1}>

                        <div className={"form-field"}>
                            <TextField error={this.state.sUserError} label="Email or Username" name="sUser"
                                       variant="outlined"
                                       value={this.state.sUser}
                                       onChange={(event) => {
                                           if (this.state.sUserError) {
                                               this.setState({
                                                   sUserError: false
                                               })
                                           }
                                           this.handleInputChange(event)
                                       }
                                       }/>
                        </div>
                        <div className={"form-field"}>
                            <TextField error={this.state.sPasswordError} label="Password" name="sPassword"
                                       variant="outlined"
                                       value={this.state.sPassword}
                                       onChange={(event) => {
                                           if (this.state.sPasswordError) {
                                               this.setState({
                                                   sPasswordError: false
                                               })
                                           }
                                           this.handleInputChange(event)
                                       }}/>
                        </div>
                        <div className={"form-field"}>
                            <TextField error={this.state.sPasswordError} label="Confirm Password" name="sCPassword"
                                       variant="outlined"
                                       value={this.state.sCPassword}
                                       onChange={(event) => {

                                           if (this.state.sPasswordError) {
                                               this.setState({
                                                   sPasswordError: false
                                               })
                                           }
                                           this.handleInputChange(event)
                                       }}/>
                        </div>
                        <div hidden={this.state.signingUp}><Button variant="contained" color="secondary"
                                                                   onClick={async () => {
                                                                       let userValidation = true;
                                                                       let passwordValidation = true;
                                                                       if (this.state.sUser === '') {
                                                                           userValidation = false;
                                                                           this.setState({
                                                                               sUserError: true,
                                                                           })
                                                                       }
                                                                       if (this.state.sPassword !== this.state.sCPassword) {
                                                                           passwordValidation = false;
                                                                           this.setState({
                                                                               sPasswordError: true,
                                                                           })
                                                                       }
                                                                       if (userValidation && passwordValidation) {
                                                                           this.setState({signingUp: true});
                                                                           const requestOptions2 = {
                                                                               method: 'POST',
                                                                               headers: {'Content-Type': 'application/json'},
                                                                               body: JSON.stringify({
                                                                                   user: this.state.sUser,
                                                                                   pwd: this.state.sPassword
                                                                               })
                                                                           };
                                                                           let result = await fetch('http://localhost:7007/signup', requestOptions2);
                                                                           let data = await result.json();
                                                                           this.setState({
                                                                               signingUp: false,
                                                                               signUpOutput: data.status
                                                                           });

                                                                       }
                                                                   }}>Sign Up
                        </Button></div>
                        <div hidden={!this.state.signingUp}><CircularProgress color="secondary"/></div>
                        <p>{this.state.signUpOutput}</p>
                    </div>
                </Paper>

            </div>);
    }
}
