import React from 'react';
import { useEffect, useContext, useState } from 'react';
import UserContext from '../context/userContext';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { returnLocalStorage } from "../components/LocalStorageHelper";
import VendorNavBar from '../Layout/VendorDashboardNavbar';
import Stack from '@mui/material/Stack';
import { Form, FormGroup, Label, Input, Col, FormFeedback } from 'reactstrap';
import IconButton from '@mui/material/IconButton';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ReviewsIcon from '@mui/icons-material/Reviews';
import CancelIcon from '@mui/icons-material/Cancel';


function VendorOrders() {
    const { data, setData } = useContext(UserContext);
    console.log(data.userData);
    // const [ratedValue, setRatedValue] = useState('');
    const [foodM, setfoodMenu] = useState(null)
    const tokenData = returnLocalStorage().token;

    useEffect(() => {
        axios.get("http://localhost/api/orders/vendorallorders", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": tokenData,
            },
        })
            .then((res) => {
                console.log(res.data);
                setfoodMenu(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const proceedToNextStage = (id, status, totalOrderInProgress) => {
        if (status === "COMPLETED") {
            alert("Order is already completed!");
            return;
        }
        if (status === "READY FOR PICKUP") {
            alert("Item is waiting for buyer to pickup!");
            return;
        }
        if (totalOrderInProgress != null && totalOrderInProgress >= 10) {
            alert("Maximum orders limit reached, cannot accept order!");
            return;
        }
        fetch("http://localhost/api/orders/updatestatus/" + id, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": tokenData,
            },
        })
            .then((res) => {
                if (res.error || res.status != 200) {
                    console.log(res)
                    alert(res.error);
                }
                else {
                    alert("Item moved to next stage successfully!");
                    window.location.replace("http://localhost:3000/vendors/orders");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const rejectOrder = (id, status) => {
        if (status === 'REJECTED') {
            alert('Order is already rejected, cannot reject again!');
            return;
        } else if (status === 'COMPLETED') {
            alert('Order is already completed, cannot now!');
            return;
        }
        fetch("http://localhost/api/orders/reject/" + id, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": tokenData,
            },
        })
            .then((res) => {
                if (res.error || res.status != 200) {
                    console.log(res)
                    alert(res.error);
                }
                else {
                    alert("Oreder is rejected successfully!");
                    window.location.replace("http://localhost:3000/vendors/orders");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div>
            <VendorNavBar />
            <div className="container" style={{ margin: "5% auto" }}>
                {foodM === null ? "Loading items..." :
                    <div align="left">
                        <h1 style={{ margin: "5% auto" }}>Your Orders</h1>

                        {foodM.map((item, index) => {
                            console.log(item);
                            return (
                                <div>
                                    <Card sx={{ maxWidth: 445 }} style={{ backgroundColor: "#ffd54f", margin: "3% 0%", padding: "2%" }}>
                                        <CardActionArea>
                                            <CardContent>
                                                <Typography gutterBottom variant="h8" component="div">
                                                    Order Time: {item.orderTime}
                                                </Typography>

                                                <Typography gutterBottom variant="h8" component="div">
                                                    Food Item: {item.name}
                                                </Typography>

                                                <Typography gutterBottom variant="h8" component="div">
                                                    Quantity: {item.quantity}
                                                </Typography>

                                                {(item.foodAddons.length != 0) ?
                                                    <div>
                                                        <h1></h1>
                                                        <Typography gutterBottom variant="h8" component="div">
                                                            Food Addons:
                                                        </Typography>
                                                        {
                                                            item.foodAddons.map((addOnItem) => {
                                                                return (
                                                                    <div style={{ maxWidth: "50%" }}>
                                                                        <Typography gutterBottom variant="h8" component="div" style={{ background: "#fff9c4", margin: "5px auto 3px 0px", padding: "1%", borderRadius: "7px", fontSize: "12.5px" }}>

                                                                            {addOnItem.name}, Rs {addOnItem.price}
                                                                        </Typography>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    :
                                                    <div></div>

                                                }

                                                <Typography gutterBottom variant="h8" component="div">
                                                    Status: {item.status}
                                                </Typography>

                                                <Typography gutterBottom variant="h8" component="div">
                                                    Total Cost: {item.totalPrice}
                                                </Typography>

                                                <Typography gutterBottom variant="h8" component="div">
                                                    Rating: {item.rating}
                                                </Typography>

                                                <h6><b>Move order to next stage</b></h6>
                                                <div>
                                                    <div style={{ padding: "1% 0% 2% 0%" }}>
                        
                                                        <Button color="primary" onClick={() => proceedToNextStage(item._id, item.status, data.userData.totalOrderInProcess)} style={{ background: "#ff5252", color: "white", marginRight:"10px"}}>
                                                            NEXT STAGE
                                                        </Button>
                                                    </div>
                                                </div>

                                                {item.status === 'PLACED' ?
                                                    <div>
                                                        <h6><b>Reject order</b></h6>
                                                        <div>
                                                            <div align="center" style={{ padding: "1% 0% 4% 0%" }}>
                                                                <IconButton aria-label="update status" align="center" size="large" onClick={() => rejectOrder(item._id, item.status)} style={{ background: "#ff5252", color: "white", marginRight: "5px" }}>
                                                                    <CancelIcon />
                                                                </IconButton>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : ""
                                                }

                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </div>
                            )
                        })
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default VendorOrders;
