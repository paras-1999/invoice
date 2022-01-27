import { TextField, Card, Stack, Button, CardHeader, Avatar, CardMedia, CardContent, CardActions } from '@mui/material'
import React, { useRef, useEffect, useState } from 'react'
import { red } from '@mui/material/colors';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import jwt_decode from 'jwt-decode'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Setting() {
    const cname = useRef(null);
    const cadd = useRef(null);
    const navigate = useNavigate();
    const [my, setMy] = useState(null)
    const updator = () => {
        if (!cname) {
            alert('enter company name')
        }
        else if (!cadd) {
            alert('enter company address')
        }
        else {
            let data = new FormData();
            data.append('cname', cname.current.value);
            data.append('cadd', cadd.current.value);
            data.append('file', document.getElementById('image').files[0]);
            axios.post(`http://localhost:8899/api/image/${my.email}`, data, { headers: { 'content-type': 'multipart/form-data' } })
            alert('due to securty reason login again')
            navigate('/');
        }
    }
    useEffect(() => {
        let token = sessionStorage.getItem("_token");
        let decode = jwt_decode(token);
        console.log(decode)
        setMy(decode)
        // cname.current.value = decode.cname;
        // cadd.current.value = decode.address;

    }, [])
    return (<>
        {my && <div>
            <Card sx={{ maxWidth: 345, mx: 'auto' }} elevation={3}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: red[500] }}>
                            <AccountCircleIcon />
                        </Avatar>
                    }

                    title={my.email}
                    subheader={my.phone}
                />
                <CardMedia
                    component="img"
                    height="150"

                    image={my.logo}
                    sx={{ borderRadius: "50%", width: '150px', mx: "auto" }}
                />
                <CardContent>
                    <Stack spacing={2} >
                        <Button
                            className='mt-4 btn btn-primary'
                            variant="contained"
                            component="label"
                        >
                            Upload Company Logo
                            <input
                                id="image"
                                name="file"
                                type="file"
                                // required
                                hidden
                            />
                        </Button>
                        <TextField id="standard-basic" label="Company Name" inputRef={cname} variant="standard" focused />
                        <TextField id="standard-basic" label="Company Address" inputRef={cadd} variant="standard" multiline
                            rows={3} focused />
                    </Stack>
                </CardContent>
                <CardActions>
                    <Button onClick={() => updator()}>submit</Button>
                </CardActions>
            </Card>

        </div >}
    </>
    )
}
