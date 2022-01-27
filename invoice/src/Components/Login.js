import { Paper, Button, Typography, TextField, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Alert, Collapse } from '@mui/material'
import React, { useState, useRef, useEffect } from 'react'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import { Link, useNavigate } from 'react-router-dom'
import { getuser } from '../config/Myservice';
export default function Login() {
    const [viewpass, setViewpass] = useState(false);
    const [open, setOpen] = useState({ err: false, msg: "" });
    const [opens, setOpens] = useState({ err: false, msg: "" });
    const navigate = useNavigate();
    const email = useRef(null);
    const pass = useRef(null);
    useEffect(() => {
        if (sessionStorage.getItem('_token') != undefined) {
            sessionStorage.removeItem('_token')
        }
    }, [])
    const validator = () => {
        setOpen({ err: false, msg: "" })
        getuser({ email: email.current.value, pass: pass.current.value }).then(res => {
            if (!res.data.err) {
                sessionStorage.setItem("_token", res.data.token);
                setOpens({ err: true, msg: res.data.msg })
                setInterval(() => {
                    navigate('/home/dash')
                }, 1000);
            }
            if (res.data.err) {
                setOpen(res.data)

            }
        })



    }
    return (
        <div className='bg'>
            <Collapse in={open.err} sx={{ position: "absolute", top: "15px", width: "50%" }}>
                <Alert
                    variant="filled" severity="error"
                    action={
                        <IconButton
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpen({ ...open, err: false });
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {open.msg}
                </Alert>
            </Collapse>
            <Collapse in={opens.err} sx={{ position: "absolute", top: "15px", width: "50%" }}>
                <Alert
                    variant="filled" severity="success"
                    action={
                        <IconButton
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpens({ ...opens, err: false });
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {opens.msg}
                </Alert>
            </Collapse>
            <div className='division'>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Vector_Book_blue.svg/1280px-Vector_Book_blue.svg.png" className='logo' />
                <hr style={{ width: "60%" }} />
                <hr />
                <Typography
                    variant='h3'
                    color='white'
                    sx={{ fontFamily: "'Teko', sans-serif", textAlign: 'center', letterSpacing: "40px" }}>
                    LEDGER
                </Typography>
                <hr />
                <hr style={{ width: "60%" }} />
            </div>
            <div className='division'>
                <Paper sx={{ width: '60%', mx: "auto", padding: "8px", '&>:not(styled)': { width: "96%", m: 1 } }}>
                    <hr style={{ background: "#42a5f5" }} />
                    <Typography
                        variant='h3'
                        color='primary.light'
                        sx={{ fontFamily: "'Teko', sans-serif", textAlign: 'center', letterSpacing: "40px", width: '100%!important' }}>
                        LEDGER
                    </Typography>
                    <hr style={{ background: "#42a5f5" }} />
                    <TextField

                        inputRef={email}
                        label="Email Id"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end" >
                                    <AccountCircleIcon color='info' />
                                </InputAdornment>
                            )
                        }}
                        variant="outlined"
                    />
                    <FormControl variant="outlined">
                        <InputLabel>Password</InputLabel>
                        <OutlinedInput
                            type={viewpass ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => { setViewpass(!viewpass) }}
                                        edge="end"
                                    >
                                        {viewpass ? <VisibilityOff color='error' /> : <Visibility color='info' />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                            inputRef={pass}
                        />
                    </FormControl>

                    <Button variant="contained" color="info" size='large' onClick={validator} endIcon={<LoginIcon />}>
                        Login
                    </Button>
                </Paper>
                <Typography variant='body2' color="white" mt={1} sx={{ textAlign: "center" }}>Don't Have an account? <Link to="/signup">Sign Up</Link></Typography>
            </div>
        </div>
    )
}
