import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Paper} from "@material-ui/core";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import {Delete} from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close'
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

export default function DataTable(props) {
    const useStyles = makeStyles({
        table: {
            minWidth: 650,
        },
    });
    let [log, setLog] = useState(props.log);
    let [deletedLog, setDeletedLog] = useState([]);
    // let [open, setOpen] = useState(false);
    //
    // let openSnackBar = function () {
    //     setOpen(true);
    // };
    // let closeSnackBar = function () {
    //     setOpen(false);
    //     setDeletedLog([]);
    // };

    let deleteRow = async function (customerId) {
        let temp = log.slice();
        for (let i = 0; i < temp.length; i++) {
            if (temp[i][0] === customerId) {
                let temp1 = temp[i];
                temp.splice(i, 1);
                setDeletedLog([temp1, i]);
                console.log({deletedLog})
            }
        }
        await fetch(' https://cors-anywhere.herokuapp.com/https://us-central1-form-manager-7234f.cloudfunctions.net/deleteCustomer')
            .then(response => {
                return response.json()
            })
            .then(data => {
                console.log(data)
            });
        await localStorage.setItem('data-log', JSON.stringify(temp));
        setLog(temp);
        // openSnackBar();
    };


    const classes = useStyles();

    let undoContact = async function () {
        let temp = log.slice();
        temp.splice(deletedLog[1], 0, deletedLog[0]);
        console.log("deleted" + deletedLog);
        console.log("temp" + temp);
        await localStorage.setItem('data-log', JSON.stringify(temp));
        setLog(temp);
        // closeSnackBar();
        console.log("log" + log)
    };

    return (<div>{log.length !== 0 && <TableContainer component={Paper} className={'table'}>
        <Table className={classes.table} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell align="center">Customer ID</TableCell>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Phone</TableCell>
                    <TableCell align="center">Gender</TableCell>
                    <TableCell align="center">Remove</TableCell>
                </TableRow>
            </TableHead>
            <TableBody key={log.length + log.length}>
                {log.map((row) => <Row key={row[0]} row={row} callback={() => {
                    deleteRow(row[0])
                }}/>)}
            </TableBody>
        </Table>
    </TableContainer>}
        {/*<Snackbar key={JSON.stringify(deletedLog)}*/}
        {/*    anchorOrigin={{*/}
        {/*        vertical: 'bottom',*/}
        {/*        horizontal: 'center',*/}
        {/*    }}*/}
        {/*    open={open}*/}
        {/*    autoHideDuration={6000}*/}
        {/*    onClose={() => closeSnackBar()}*/}
        {/*    message="Customer Deleted"*/}
        {/*    action={*/}
        {/*        <React.Fragment>*/}
        {/*            <Button color="secondary" size="small" onClick={() => undoContact()}>*/}
        {/*                UNDO*/}
        {/*            </Button>*/}
        {/*            <IconButton size="small" aria-label="close" color="inherit" onClick={() => closeSnackBar()}>*/}
        {/*                <CloseIcon fontSize="small"/>*/}
        {/*            </IconButton>*/}
        {/*        </React.Fragment>*/}
        {/*    }*/}
        {/*/>*/}
    </div>);
}

function Row(props) {
    let row = (props.row);
    let [isDeleting, setDeleting] = useState(false);

    return (<TableRow key={row[0]}>
        <TableCell align="center">{row[0]}</TableCell>
        <TableCell align="center">{row[1]}</TableCell>
        <TableCell align="center">{row[2]}</TableCell>
        <TableCell align="center">{row[3]}</TableCell>
        <TableCell align="center">
            {!isDeleting && <Delete onClick={() => {
                setDeleting(true);
                props.callback();
            }}/>}
            {isDeleting && <CircularProgress color="secondary"/>}
        </TableCell>
    </TableRow>)
}