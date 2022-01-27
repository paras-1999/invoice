import { Grid, Typography, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { dashdata } from '../config/Myservice';
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom';
export default function Dash() {
    const [ddata, setDdata] = useState(null);
    const navigate = useNavigate()
    useEffect(() => {
        let token = sessionStorage.getItem("_token");
        let decode = jwt_decode(token)
        dashdata(decode.email, sessionStorage.getItem('_token')).then(res => {
            if (res.data.err) {
                alert(res.data.msg);
                navigate('/');
            }
            console.log(res.data)
            setDdata(res.data)
        })
    }, [])
    let a = { totalamount: 0, totalinvoice: 0, paidamount: 0, paidinvoice: 0, unpaidamount: 0, unpaidinvoice: 0 };

    return (
        <>
            {ddata && <div className='dash'>
                <Grid container spacing={5} sx={{ width: "70%", mx: "auto" }}>
                    <Grid item xs={6} md={4}>
                        <Paper sx={{ background: "#2196f3", color: 'white', height: '200px', width: "250px", mx: "auto" }} >
                            # {ddata.totalinvoice}
                            <Typography variant='h6'> Total Invoice </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <Paper sx={{ background: "#4caf50", color: 'white', height: '200px', width: "250px", mx: "auto" }} >
                            # {ddata.paidinvoice}
                            <Typography variant='h6'> Total Paid Invoice </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <Paper sx={{ background: "#f44336", color: 'white', height: '200px', width: "250px", mx: "auto" }} >
                            # {ddata.unpaidinvoice}
                            <Typography variant='h6'> Total UnPaid Invoice </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <Paper sx={{ background: "#2196f3", color: 'white', height: '200px', width: "250px", mx: "auto" }} >
                            $
                            <Typography variant='h6'>  {ddata.totalamount}</Typography>
                            <Typography variant='h6'> Total Amount </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <Paper sx={{ background: "#4caf50", color: 'white', height: '200px', width: "250px", mx: "auto" }} >
                            $
                            <Typography variant='h6'>  {ddata.paidamount}</Typography>
                            <Typography variant='h6'> Total Paid Amount </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <Paper sx={{ background: "#f44336", color: 'white', height: '200px', width: "250px", mx: "auto" }} >
                            $
                            <Typography variant='h6'>  {ddata.unpaidamount}</Typography>
                            <Typography variant='h6'> Total UnPaid Amount </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </div>}
        </>
    )
}
