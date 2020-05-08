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
import CircularProgress from "@material-ui/core/CircularProgress";


export default function DataTable(props) {
    const useStyles = makeStyles({
        table: {
            minWidth: 650,
        },
    });
    let log = props.log;
    const classes = useStyles();
    let deleteRow = props.deleteCallback;

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
                {log.map((row) => <Row key={row.id} row={row} callback={() => {
                    deleteRow(row.id)
                }}/>)}
            </TableBody>
        </Table>
    </TableContainer>}
    </div>);
}

function Row(props) {
    let row = (props.row);
    let [isDeleting, setDeleting] = useState(false);

    return (<TableRow key={row.id}>
        <TableCell align="center">{row._id}</TableCell>
        <TableCell align="center">{row.name}</TableCell>
        <TableCell align="center">{row.number}</TableCell>
        <TableCell align="center">{row.gender}</TableCell>
        <TableCell align="center">
            {!isDeleting && <Delete onClick={async () => {
                setDeleting(true);
                await props.callback();
            }}/>}
            {isDeleting && <CircularProgress color="secondary"/>}
        </TableCell>
    </TableRow>)
}