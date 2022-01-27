import React, { useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getrecords, updaterecords } from '../config/Myservice';
import { useNavigate } from 'react-router-dom';
export default function Records() {
    const [records, setRecords] = useState([])
    const navigate = useNavigate();
    useEffect(() => {
        let token = sessionStorage.getItem("_token");
        let decode = jwt_decode(token);
        getrecords(decode.email, sessionStorage.getItem("_token")).then(res => {
            if (res.data.err) {
                alert(res.data.msg);
                navigate('/');
            }
            setRecords(res.data)
        })
    }, [])
    const update = (i) => {
        let temp = [...records];
        temp[i].status = "PAID";
        setRecords(temp);
        updaterecords(temp[i])
    }
    return (
        <div>
            <TableContainer component={Paper} >
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>Invoice</TableCell>
                            <TableCell >To(Company Name)</TableCell>
                            <TableCell >Amount</TableCell>
                            <TableCell >Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records.map((row, i) => (
                            <TableRow
                                key={row._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    # {i + 1}
                                </TableCell>
                                <TableCell >{row.reciever.name}({row.reciever.company})</TableCell>
                                <TableCell >$ {row.total}</TableCell>
                                <TableCell ><Typography variant='h6' color={row.status == 'UNPAID' ? 'error.light' : 'success'} sx={{ fontFamily: "'Teko', sans-serif" }} >{row.status}</Typography></TableCell>
                                <TableCell >
                                    {row.status == 'UNPAID' ? <Button variant="outlined" color="success" size="small" sx={{ borderRadius: '20px' }} onClick={() => update(i)}>
                                        pay
                                    </Button> : <CheckCircleIcon color='success' sx={{ marginLeft: "20px" }} />}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
