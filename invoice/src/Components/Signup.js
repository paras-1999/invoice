import { Paper, Button, Typography, TextField, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Alert, Collapse } from '@mui/material'
import React, { useState, useRef } from 'react'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from 'react-router-dom'
import { adduser } from '../config/Myservice';
const regForName = RegExp(/^[A-Z a-z]{4,29}$/);
const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForPhone = RegExp(/^[7-9][0-9]{9}$/);
const regForPass = RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/);
export default function Signup() {
    const [viewpass, setViewpass] = useState({ cpass: false, rpass: false })
    const [open, setOpen] = useState({ msg: "", val: false });
    const name = useRef(null);
    const cname = useRef(null);
    const email = useRef(null);
    const phone = useRef(null);
    const pass = useRef(null);
    const rpass = useRef(null);
    const address = useRef(null);
    const navigate = useNavigate();
    const validation = () => {
        setOpen({ msg: "", val: false })
        console.log(address.current.value.toString().length);

        if (!name.current.value || !regForName.test(name.current.value)) {
            setOpen({ msg: "Enter A Valid Name", val: true })
        }
        else if (!cname.current.value || !regForName.test(cname.current.value)) {
            setOpen({ msg: "Enter A Company", val: true })
        }
        else if (!email.current.value || !regForEmail.test(email.current.value)) {
            setOpen({ msg: "Enter A Valid Email", val: true })
        }
        else if (!phone.current.value || !regForPhone.test(phone.current.value)) {
            setOpen({ msg: "Enter A Valid Number", val: true })
        }
        else if (!pass.current.value || !regForPass.test(pass.current.value)) {
            setOpen({ msg: "6-16 Digit Password Atleast One Uppercase Lowercase & Special Character", val: true })
        }
        else if (!rpass.current.value || rpass.current.value !== pass.current.value) {
            setOpen({ msg: "Not Match", val: true })
        }
        else if (address.current.value.toString().length < 10) {
            setOpen({ msg: "Enter A Valid Address", val: true })
        }
        else {
            adduser({ name: name.current.value, cname: cname.current.value, email: email.current.value, phone: phone.current.value, pass: pass.current.value, address: address.current.value }).then(res => {
                alert(res.data)
            })
            navigate('/');
        }
    }
    return (
        <div className='bg'>
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
                <Paper sx={{ width: '80%', mx: "auto", padding: "8px", marginTop: "-40px", '&>:not(styled)': { width: "47%", m: 1 } }}>
                    <Collapse in={open.val} sx={{ width: "100% !important", m: "0 !important" }}>
                        <Alert
                            variant="filled" severity="error"
                            action={
                                <IconButton
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setOpen({ ...open, val: false });
                                    }}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            {open.msg}
                        </Alert>
                    </Collapse>
                    <TextField id="outlined-basic" label="Name" inputRef={name} variant="outlined" />
                    <TextField id="outlined-basic" label="Company Name" inputRef={cname} variant="outlined" />
                    <TextField id="outlined-basic" label="Email" inputRef={email} variant="outlined" />
                    <TextField id="outlined-basic" label="Phone" inputRef={phone} variant="outlined" />
                    <FormControl variant="outlined">
                        <InputLabel>Password</InputLabel>
                        <OutlinedInput
                            type={viewpass.cpass ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => { setViewpass({ ...viewpass, cpass: !viewpass.cpass }) }}
                                        edge="end"
                                    >
                                        {viewpass.cpass ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                            inputRef={pass}
                        />
                    </FormControl>
                    <FormControl variant="outlined">
                        <InputLabel>R-Password</InputLabel>
                        <OutlinedInput
                            type={viewpass.rpass ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => { setViewpass({ ...viewpass, rpass: !viewpass.cpass }) }}
                                        edge="end"
                                    >
                                        {viewpass.rpass ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                            inputRef={rpass}
                        />
                    </FormControl>
                    <TextField
                        label="Company Address"
                        multiline
                        rows={3}
                        sx={{ width: '97% !important' }}
                        inputRef={address}
                    />
                    <Button variant="contained" color="info" size='large' onClick={validation} sx={{ width: '97% !important' }} endIcon={<BorderColorIcon />}>
                        Register
                    </Button>
                </Paper>
                <Typography variant='body2' color="white" mt={1} sx={{ textAlign: "center" }}>Have an account? <Link to="/">Log in</Link></Typography>
            </div>
        </div>
    )
}
