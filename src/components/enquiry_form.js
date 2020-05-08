import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItem from "@material-ui/core/MenuItem";
import DataTable from "./data_table";
import CloseIcon from '@material-ui/icons/Close'
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";

class EnquiryForm extends React.Component {
    state = {
        customerName: '',
        number: '',
        gender: 'male',
        loading: false,
        customers: [],
        open: false,
        undoCustomer: null
    };

    componentDidMount() {
        this.getCustomersFromLocalServer();
    }

    async getCustomersFromLocalServer() {
        this.setState({
            loading: true,
        });
        let response = await fetch('http://localhost:7007/customers', {credentials: 'include'});
        if (response.status == 200) {
            let data = await response.json();
            this.setState({
                loading: false,
                customers: data,
            })
        } else if (response.status !== 200) {
            alert('you must be logged in');
            this.props.history.push(``)

        }
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
                {this.state.customers.length !== 0 && <DataTable deleteCallback={async (id) => {
                    await this.deleteCustomer(id)
                }} log={this.state.customers}
                                                                 key={this.state.customers[this.state.customers.length - 1]['id'] + this.state.customers.length}/>}
                <SnackBar open={this.state.open} key={this.state.customers} undoCallback={async () => {
                    await this.undoFunction();
                }}/>
            </div>
        );
    }

    async undoFunction() {
        //close the snackBar
        this.setState({
            open: false
        });
        // add customer to server at an index
        const requestOptions2 = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: this.state.undoCustomer})
        };
        await fetch('http://localhost:7007/customers/undo', requestOptions2);
        // fetching updated customers list
        let response3 = await fetch('http://localhost:7007/customers',{credentials:"include"});
        let tempLog = await response3.json();
        this.setState({
            customers: tempLog,
        });

    }

    async deleteCustomer(id) {
        console.log(id);

        this.setState({
                open: true
            }
        );
        // delete customer on server
        const requestOptions2 = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: id})
        };
        await fetch('http://localhost:7007/customers/delete', requestOptions2);
        let deletedCustomer = id;
        // get latest list oof customers from server
        let response = await fetch('http://localhost:7007/customers', {credentials: "include"});
        let data = await response.json();
        console.log(data);
        this.setState({
            customers: data,
            undoCustomer: deletedCustomer
        })
    }

    async saveCustomer() {
        if (!this.state.loading) {
            this.setState({
                loading: true,
            });
            // getting new customer id
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(this.state)
            };
            let cstId;
            await fetch('https://cors-anywhere.herokuapp.com/https://us-central1-form-manager-7234f.cloudfunctions.net/saveCustomer', requestOptions)
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    cstId = data['customerID']
                });
            // creating new customer object
            let newCustomer = {
                id: cstId,
                name: this.state.customerName,
                number: this.state.number,
                gender: this.state.gender
            };
            //adding this new customer
            const requestOptions2 = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
                body: JSON.stringify(newCustomer)
            };
            await fetch('http://localhost:7007/customers/add', requestOptions2);
            // fetching updated customers list
            let response3 = await fetch('http://localhost:7007/customers', {credentials: "include"});
            let tempLog = await response3.json();
            this.setState({
                loading: false,
                customerName: '',
                number: '',
                customers: tempLog
            });
        }

    }
}

function SnackBar(props) {
    let [open, setOpen] = useState(props.open);
    let key = props.key;
    return (
        <Snackbar key={JSON.stringify(key)}
                  anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                  }}
                  open={open}
                  autoHideDuration={3000}
                  onClose={() => {
                      setOpen(false);
                  }}
                  message="Customer Deleted"
                  action={
                      <React.Fragment>
                          <Button color="secondary" size="small" onClick={() => {
                              props.undoCallback()
                          }}>
                              UNDO
                          </Button>
                          <IconButton size="small" aria-label="close" color="inherit" onClick={() => {
                              setOpen(false);
                          }}>
                              <CloseIcon fontSize="small"/>
                          </IconButton>
                      </React.Fragment>
                  }
        />
    )
}

export default EnquiryForm;