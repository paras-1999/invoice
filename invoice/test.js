import React, { useEffect, useState, useRef } from 'react'
import jwt_decode from 'jwt-decode'
import { Paper, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField, Alert, Collapse, IconButton, Box, Table, TableContainer, TableHead, TableRow, InputBase, TableCell, TableBody } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import ReactToPdf from 'react-to-pdf'
import { addinvoice } from '../config/Myservice';
import { useNaviagte, useNavigate } from 'react-router-dom';
const regForName = RegExp(/^[A-Z a-z]{4,29}$/);
const options = {
    orientation: 'portrait',
    unit: 'in',
    format: 'A4'
};
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    large: {
        width: theme.spacing(12),
        height: theme.spacing(12),
    },
    table: {
        minWidth: 600,
    },

    headerContainer: {
        // display: 'flex'
        paddingTop: theme.spacing(1),
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(1),
    }
}));
export default function Invoice() {
    const [myData, setMyData] = useState(null);
    const [cDate, setCDate] = useState(null);
    const [dDate, setDDate] = useState(null);
    const [open, setOpen] = useState(false);
    const [filled, setFilled] = useState(false);
    // const [subTotal, setSubTotal] = useState(0)
    const navigate = useNavigate();
    const [sname, setSname] = useState(null)
    const [scname, setScname] = useState(null)
    const [sadd, setSadd] = useState(null)
    const pdfRef = useRef(null);
    const [opena, setOpena] = useState({ msg: "", val: false });
    // -------------------------------------------------------------------
    const [invoiceData, setInvoiceData] = useState({
        items: [
            { itemName: '', unitPrice: '', quantity: '', discount: '' },
        ],
        total: 0,
        invoiceNumber: 1,
        status: 'UNPAID',
    }
    )


    const handleAddField = (e) => {
        e.preventDefault()
        setInvoiceData((prevState) => ({ ...prevState, items: [...prevState.items, { itemName: '', unitPrice: '', quantity: '', discount: '' }] }))
        upadte();
    }

    const handleChange = (index, e) => {
        const values = [...invoiceData.items]
        values[index][e.target.name] = e.target.value
        setInvoiceData((prevState) => ({ ...prevState, items: [...values] }));
        upadte();

    }
    const handleRemoveField = (index) => {
        const values = invoiceData.items
        values.splice(index, 1)
        setInvoiceData((prevState) => ({ ...prevState, values }))
        upadte();
        // console.log(values)
    }
    const classes = useStyles()
    // -----------------------------------------------------------------------

    const validator = () => {
        if (!sname || !regForName.test(sname)) {
            setOpena({ msg: "Enter A Valid Name", val: true })
        }
        else if (!scname || !regForName.test(scname)) {
            setOpena({ msg: "Enter A Valid Company Name", val: true })
        }
        else if (sadd.length < 10) {
            setOpena({ msg: "Enter A Valid Address", val: true })
        }
        else {
            setOpen(false)
            setFilled(true)
        }

    }
    useEffect(() => {
        let token = sessionStorage.getItem("_token");
        let decode = jwt_decode(token)
        console.log(decode)
        setMyData(decode)
        // const dateOptions = {
        //     day: 'numeric',
        //     month: 'long',
        //     year: 'numeric'
        // };
        // let date = new Date().toLocaleDateString('en-EN', dateOptions)
        let date = new Date()
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let cDate = `${day}/${month}/${year}`;
        let dueDate = new Date(new Date().getTime() + (5 * 24 * 60 * 60 * 1000));
        let dDate = `${dueDate.getDate()}/${dueDate.getMonth() + 1}/${dueDate.getFullYear()}`;
        setCDate(cDate)
        setDDate(dDate)

    }, [])
    const upadte = () => {
        var arr = document.getElementsByName("amount");
        var subtotal = 0;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].value) {
                subtotal += +arr[i].value;
            }
            setInvoiceData((prevState) => ({ ...prevState, total: subtotal }))
            // setSubTotal(subtotal)
            setFilled(filled)
        }
    }
    const handleadder = () => {
        let info = { email: myData.email, invoicenumber: invoiceData.invoiceNumber, details: invoiceData.items, total: invoiceData.total, reciever: { name: sname, company: scname, address: sadd }, status: invoiceData.status }
        addinvoice(info).then(res => {
            alert(res.data)
            navigate('/home/dash')
        })
    }
    return (
        <>
            {myData != null &&
                <div ref={pdfRef}>
                    <Paper elevation={3} sx={{ width: "70%", mx: "auto", textAlign: 'center', '&>:not(styled)': { fontFamily: "'Barlow Condensed', sans-serif" } }}>
                        <Typography variant='h2' >Invoice</Typography>
                        <Typography variant='h3' >{myData.cname}</Typography>
                        <Typography variant='h6' >{myData.email}</Typography>
                        <Typography variant='body' >{myData.address}</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6} md={6} sx={{ textAlign: 'left', paddingLeft: "40px !important" }}>
                                <Typography variant='body'  >{myData.name} : {myData.phone}</Typography>
                            </Grid>
                            <Grid item xs={6} md={6} sx={{ textAlign: 'right', paddingRight: "20px !important" }}>
                                <Typography variant='body' >Invoice Date : {cDate}</Typography>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <hr style={{ background: "#42a5f5", width: "95%", marginTop: "-15px" }} />
                            </Grid>

                            <Grid item xs={6} md={6} >
                                {filled ? <Box sx={{ textAlign: 'left', paddingLeft: "20px" }}> <Typography variant='h6'>Bill to :
                                    <IconButton color="error" onClick={() => setFilled(false)}>
                                        <CancelTwoToneIcon />
                                    </IconButton>
                                </Typography>
                                    {
                                        <>
                                            <Typography variant='body'>{sname}</Typography><br />
                                            <Typography variant='body'>{scname}</Typography><br />
                                            <Typography variant='body'>{sadd}</Typography>
                                        </>
                                    }

                                </Box>
                                    : <Button variant="outlined" sx={{ borderRadius: '20px', marginTop: "30px !important" }} onClick={() => setOpen(true)} startIcon={<AddCircleIcon />}>
                                        Add Reciever
                                    </Button>}

                                <Dialog
                                    open={open}
                                    onClose={() => setOpen(false)}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <Collapse in={opena.val} sx={{ width: "100% !important", m: "0 !important" }}>
                                        <Alert
                                            variant="filled" severity="error"
                                            action={
                                                <IconButton
                                                    color="inherit"
                                                    size="small"
                                                    onClick={() => {
                                                        setOpena({ ...open, val: false });
                                                    }}
                                                >
                                                    <CloseIcon fontSize="inherit" />
                                                </IconButton>
                                            }
                                        >
                                            {opena.msg}
                                        </Alert>
                                    </Collapse>
                                    <DialogTitle>
                                        Fill Reciever Details
                                    </DialogTitle>
                                    <DialogContent>
                                        <Stack spacing={2} sx={{ width: "500px", paddingY: "10px" }}>
                                            <TextField label="Name" onChange={(e) => { setSname(e.target.value) }} variant="outlined" />
                                            <TextField label="Company Name" onChange={(e) => { setScname(e.target.value) }} variant="outlined" />
                                            <TextField multiline
                                                rows={3} label="Address" onChange={(e) => { setSadd(e.target.value) }} variant="outlined" />
                                        </Stack>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => validator()}>Add</Button>
                                    </DialogActions>
                                </Dialog>
                            </Grid>

                            <Grid item xs={6} md={6} sx={{ textAlign: 'right', paddingRight: "20px !important" }}>
                                <Typography variant='h1' color='error.light' sx={{ fontFamily: "'Teko', sans-serif" }} >{invoiceData.status}</Typography>
                                <Typography variant='body'  >Due Date :{dDate}</Typography>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <hr style={{ background: "#42a5f5", width: "95%", marginTop: "-15px" }} />
                            </Grid>
                        </Grid>
                        <TableContainer>
                            <Table className={classes.table} >
                                <TableHead>
                                    <TableRow>
                                        <TableCell >Item</TableCell>
                                        <TableCell  >Qty</TableCell>
                                        <TableCell >Price</TableCell>
                                        <TableCell  >Disc(%)</TableCell>
                                        <TableCell  >Amount</TableCell>
                                        <TableCell  >Action</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {invoiceData.items.map((itemField, index) => (
                                        <TableRow key={index}>
                                            <TableCell scope="row" style={{ width: '40%' }}> <InputBase style={{ width: '100%' }} outline="none" sx={{ ml: 1, flex: 1 }} type="text" name="itemName" onChange={e => handleChange(index, e)} value={itemField.itemName} placeholder="Item name or description" /> </TableCell>
                                            <TableCell align="right" > <InputBase sx={{ ml: 1, flex: 1 }} type="number" name="quantity" onChange={e => handleChange(index, e)} value={itemField.quantity} placeholder="0" /> </TableCell>
                                            <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="number" name="unitPrice" onChange={e => handleChange(index, e)} value={itemField.unitPrice} placeholder="0" /> </TableCell>
                                            <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="number" name="discount" onChange={e => handleChange(index, e)} value={itemField.discount} placeholder="0" /> </TableCell>
                                            <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="number" name="amount" onChange={e => handleChange(index, e)} value={(itemField.quantity * itemField.unitPrice) - (itemField.quantity * itemField.unitPrice) * itemField.discount / 100} disabled /> </TableCell>
                                            <TableCell align="right">
                                                <IconButton onClick={() => handleRemoveField(index)}>
                                                    <DeleteIcon style={{ width: '20px', height: '20px' }} />
                                                </IconButton>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div >
                            <IconButton color="primary" onClick={handleAddField}>
                                <AddCircleIcon style={{ fontSize: '50px' }} />
                            </IconButton>

                        </div>
                        <Grid>
                            <Grid item xs={12} md={12}>
                                <Typography variant='h2' color='success.light' sx={{ fontFamily: "'Teko', sans-serif", textAlign: 'right', paddingRight: "15px" }}>$ {invoiceData.total}</Typography>
                            </Grid>
                        </Grid>

                    </Paper>
                </div>

            }
            <ReactToPdf targetRef={pdfRef} filename={`${sname}_invoice.pdf`} options={options} x={-1} y={0} scale={0.8}>
                {({ toPdf }) => (
                    <Button onClick={() => toPdf()} variant="contained" endIcon={<SaveIcon />}>
                        Save Pdf
                    </Button>
                )}
            </ReactToPdf>
            <Button onClick={handleadder} variant="contained" endIcon={<SaveIcon />}>
                ADD to log
            </Button>
        </>
    )
}
