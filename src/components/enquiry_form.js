import React from "react";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItem from "@material-ui/core/MenuItem";
import DataTable from "./data_table";

class EnquiryForm extends React.Component {
    state = {
        customerName: '',
        number: '',
        gender: 'male',
        loading: false,
        customers: []
    };

    componentDidMount() {
        let temp = JSON.parse(localStorage.getItem('data-log'));
        this.setState({
            customers: temp !== null ? temp : []
        })
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    render() {
        return (
            <div className={"form"}>
                <form className={"form"}>
                    <div className={"form-field"}>
                        <TextField label="Name" name="customerName" variant="outlined" value={this.state.customerName}
                                   onChange={(event) => this.handleInputChange(event)}/>
                    </div>
                    <div className={"form-field"}>
                        <TextField label="Phone Number" name="number" variant="outlined" value={this.state.number}
                                   type="number"
                                   onChange={(event) => this.handleInputChange(event)}/>
                    </div>

                    <Select className={"form-field"} name="gender" value={this.state.gender}
                            onChange={(event) => this.handleInputChange(event)}>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                    </Select>


                </form>
                <Button variant="contained" color="secondary" onClick={() => this.saveCustomer()}>Save info
                </Button>
                {this.state.loading && <div className={"form-field"}><CircularProgress color="secondary"/></div>}
                {this.state.customers.length !== 0 && <DataTable log={this.state.customers} key={this.state.customers[this.state.customers.length-1][0]}/>}
            </div>
        );
    }

    async saveCustomer() {

        if (!this.state.loading) {
            this.setState({
                loading: true,
            });
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(this.state)
            };
            let custId;

            await fetch('https://cors-anywhere.herokuapp.com/https://us-central1-form-manager-7234f.cloudfunctions.net/saveCustomer', requestOptions)
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    custId = data['customerID']
                });
            let str = await localStorage.getItem('data-log');
            let tempLog = JSON.parse(str);
            let newLog = [custId, this.state.customerName, this.state.number, this.state.gender];
            tempLog = [...tempLog, newLog];
            localStorage.setItem('data-log', JSON.stringify(tempLog));
            this.setState({
                loading: false,
                customerName: '',
                number: '',
                customers: tempLog
            });
        }

    }
}

export default EnquiryForm;