import React, { useContext, useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import UserContext from '../context/userContext'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaidIcon from '@mui/icons-material/Paid';
import { Form, FormGroup, Label, Input, Col, FormFeedback } from 'reactstrap';
import IconButton from '@mui/material/IconButton';
import { returnLocalStorage } from "../components/LocalStorageHelper";

export default function BuyerDetails() {
    const { data, setData } = useContext(UserContext);
    const [money, setMoney] = useState();
    const tokenData = returnLocalStorage().token;

    const handleMoney = (e) => {
        setMoney(e.target.value);
    }

    function validate(money) {

        const errors = {
            money: '',
        };
        if (money < 0) {
            errors.money = "Money to be added into wallet cannot be negative";
        }
    
        return errors;
    }

    const addMoneyToWallet = () => {
        fetch("http://localhost/api/buyers/addmoney", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": tokenData,
            }, body: JSON.stringify({
                walletMoney: money
            })
        })
            .then((res) => {
                if (res.error || res.status != 200) {
                    console.log(res)
                    alert(res.error);
                }
                else {
                    alert("Money added successfully!");
                    window.location.replace("http://localhost:3000/buyers/dashboard");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    let errors = validate(money);

    return (
        <div>
            {data.userData === null ? "Loading..." :
                <div>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <AccountCircleIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Name" secondary={data.userData.name} />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <EmailIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Email" secondary={data.userData.email} />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <CallIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Contact Number" secondary={data.userData.contactNumber} />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <SchoolIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Batch Name" secondary={data.userData.batch} />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Age" secondary={data.userData.age} />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <AccountBalanceWalletIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Wallet money" secondary={data.userData.walletMoney} />
                        </ListItem>

                        <div align="center" style={{padding:"4% 0%"}}>
                            <Form>
                                <FormGroup row>
                                    <Label htmlFor="addMoney" md={2}>Add money</Label>
                                    <Col md={10}>
                                        <Input type="Number" id="addmoney" name="addmoney"
                                            value={money}
                                            placeholder={"Enter money value"}
                                            onChange={handleMoney}
                                            valid={errors.money === ''}
                                            invalid={errors.money !== ''}
                                        />
                                        <FormFeedback>{errors.money}</FormFeedback>
                                    </Col>
                                </FormGroup>

                                <IconButton aria-label="delete" align="center" size="large" onClick={addMoneyToWallet} style={{ background: "#ff5252", color: "white", marginRight: "5px" }}>
                                    <PaidIcon />
                                </IconButton>
                            </Form>
                        </div>

                    </List>
                </div>
            }
        </div>
    );
}

