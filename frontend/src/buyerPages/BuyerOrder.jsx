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
import BuyerNavBar from './BuyerNavbar';
import Stack from '@mui/material/Stack';
import { Form, FormGroup, Label, Input, Col, FormFeedback } from 'reactstrap';
import IconButton from '@mui/material/IconButton';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ReviewsIcon from '@mui/icons-material/Reviews';


function BuyersOrders() {
    const { data, setData } = useContext(UserContext);
    const [ratedValue, setRatedValue] = useState('');
    const [foodM, setfoodMenu] = useState(null)
    const tokenData = returnLocalStorage().token;

    useEffect(() => {
        axios.get("http://localhost/api/orders/myallorders", {
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
                alert("Oops something went wrong");
                console.log(err);
            });
    }, []);

    const pickUpFoodItem = (id) => {
        fetch("http://localhost/api/orders/pickup/" + id, {
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
                    alert("Order picked-up successfully!");
                    window.location.replace("http://localhost:3000/buyers/orders");
                }
            })
            .catch((err) => {
                alert("Oops something went wrong, Order not picked-up!");
                console.log(err);
            });
    }

    const rateFoodItem = (id, status, isRated, orderid) => {
        if (status != "COMPLETED") {
            alert("Rating item not possible, rate after completing order!");
            return;
        }
        
        if (isRated === true) {
            alert("Item is already rated for this order!");
            return;
        }
        
        if (status === 'REJECTED') {
            alert("Order is rejected, cannot rate food item");
            return;
        }
        
        if (errors.ratedValue != '') {
            alert(errors.ratedValue);
            return;
        }
        

        fetch("http://localhost/api/fooditems/ratefood/" + id, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": tokenData,
            },
            body: JSON.stringify({
                ratedValue
            })
        })
            .then((res) => {
                if (res.error || res.status != 200) {
                    console.log(res)
                    alert(res.error);
                }
                else {
                    fetch("http://localhost/api/orders/isRated/" + orderid, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": tokenData,
                        }
                    })
                        .then((res) => {
                            if (res.error || res.status != 200) {
                                console.log(res)
                                alert(res.error);
                            }
                            else {

                                alert("Food item rated successfully!");
                                window.location.replace("http://localhost:3000/buyers/menu");
                            }
                        })
                        .catch((err) => {
                            alert("Oops something went wrong, item not rated!");
                            console.log(err);
                        });
                }
            })
            .catch ((err) => {
        console.log(err);
    });
}

function validate(ratings) {

    const errors = {
        ratedValue: '',
    };
    if (ratings === null || ratings === undefined || ratings === '') {
        errors.ratedValue = "Rating item not possible, rate after completing order";
    }
    else if (ratings < 0) {
        errors.ratedValue = "Rating cannot be negative";
    }
    else if (ratings > 5) {
        errors.ratedValue = "Rating cannot be greater than 5";
    }

    return errors;
}

const handleRatedValue = (e, status) => {
    if (status != 'COMPLETED')
        setRatedValue(null);
    else
        setRatedValue(e.target.value);
}

let errors = validate(ratedValue);

// Placed Time, Vendor Name, Food Item, Quantity, Status, Cost and Rating.
return (
    <div>
        <BuyerNavBar />
        <div className="container" style={{ margin: "5% auto" }}>
            {foodM === null ? "Loading items..." :
                <div align="left">
                    <h1 style={{ margin: "5% auto" }}>Your Orders</h1>

                    {foodM.map((item, index) => {
                        return (
                            <div>
                                <Card sx={{ maxWidth: 445 }} style={{ backgroundColor: "#ffd54f", margin: "3% 0%", padding: "2%" }}>
                                    <CardActionArea>
                                        <CardContent>
                                            <Typography gutterBottom variant="h8" component="div">
                                                Order Time: {item.orderTime}
                                            </Typography>

                                            <Typography gutterBottom variant="h8" component="div">
                                                Vendor Name: {item.vendor.name}
                                            </Typography>

                                            <Typography gutterBottom variant="h8" component="div">
                                                Food Item: {item.name}
                                            </Typography>

                                            <Typography gutterBottom variant="h8" component="div">
                                                Quantity: {item.quantity}
                                            </Typography>

                                            <Typography gutterBottom variant="h8" component="div">
                                                Status: {item.status}
                                            </Typography>

                                            <Typography gutterBottom variant="h8" component="div">
                                                Total Cost: {item.totalPrice}
                                            </Typography>

                                            <Typography gutterBottom variant="h8" component="div">
                                                Rating: {item.rating}
                                            </Typography>

                                            {item.status === 'READY FOR PICKUP' ?
                                                <div>
                                                    <div align="center" style={{ padding: "1% 0% 4% 0%" }}>
                                                        <IconButton aria-label="fastfoodpickup" align="center" size="large" onClick={() => pickUpFoodItem(item._id)} style={{ background: "#ff5252", color: "white", marginRight: "5px" }}>
                                                            <FastfoodIcon />
                                                        </IconButton>
                                                    </div>
                                                </div>
                                                : ""}
                                        {item.isRated === false && item.status === "COMPLETED" ? 
                                            <div align="center">
                                                <Form>
                                                    <FormGroup row>
                                                        <Label htmlFor="ratedValue" md={2}>Rate food</Label>
                                                        <Col md={10}>
                                                            <Input type="Number" id="ratefood" name="ratefood"
                                                                value={ratedValue}
                                                                placeholder={"Enter rating value 0 - 5"}
                                                                onChange={(e) => handleRatedValue(e, item.status)}
                                                                valid={errors.ratedValue === ''}
                                                                invalid={errors.ratedValue !== ''}
                                                            />
                                                            <FormFeedback>{errors.ratedValue}</FormFeedback>
                                                        </Col>
                                                    </FormGroup>

                                                    <IconButton aria-label="delete" align="center" size="large" onClick={() => rateFoodItem(item.itemid, item.status, item.isRated, item._id)} style={{ background: "#ff5252", color: "white", marginRight: "5px" }}>
                                                        <ReviewsIcon />
                                                    </IconButton>
                                                </Form>
                                            </div>
                                        : ""}
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

export default BuyersOrders;
