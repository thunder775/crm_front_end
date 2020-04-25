import React, {useEffect, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Paper} from "@material-ui/core";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import {Delete} from '@material-ui/icons';
import CircularProgress from "@material-ui/core/CircularProgress";
import SnackbarContent from "@material-ui/core/SnackbarContent";

export default function DataTable(props) {
    const useStyles = makeStyles({
        table: {
            minWidth: 650,
        },
    });
    let [log, setLog] = useState(props.log);
    let deleteRow = async function (customerId) {
        let temp = log.slice();
        for (let i = 0; i < temp.length; i++) {
            if (temp[i][0] === customerId) {
                temp.splice(i, 1);
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
    };


    const classes = useStyles();
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
            <TableBody>
                {log.map((row) => <Row key={row[0]} row={row} callback={() => {
                    deleteRow(row[0])
                }}/>)}
            </TableBody>
        </Table>
    </TableContainer>}
        {/*<SnackbarContent message="I love snacks." action={() => {*/}
        {/*}} anchorOrigin={{*/}
        {/*    vertical: 'bottom',*/}
        {/*    horizontal: 'left',*/}
        {/*}}/>*/}
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