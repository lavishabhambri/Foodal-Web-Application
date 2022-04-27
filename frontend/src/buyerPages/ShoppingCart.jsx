import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import BuyerNavBar from './BuyerNavbar';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import UserContext from '../context/userContext';
import { Button, Form, FormGroup, Label, Input, Col, FormFeedback } from 'reactstrap';
import Checkbox from '@mui/material/Checkbox';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


function ShoppingCart(props) {

    const location = useLocation();
    const item = props.location.state;
    console.log(item);
    function validate(quantity) {
        const errors = {
            quantity: ''
        };
        if(quantity <= 0) {
            errors.quantity = "Quantity cannot be less than or equal to zero";
        }
        return errors;
    }

    const { data, setData } = useContext(UserContext);
    console.log(data);

    const [totalPrice, setTotalPrice] = useState(0);
    const [foodAddonsByBuyer, setFoodAddonsByBuyer] = useState([]);
    const [quantity, setQuantiy] = useState(1);
    const [boxesChecked, setBoxesChecked] = useState(new Array(item.foodAddons.length).fill(false));

    function handleQuantity(event) {
        setQuantiy(event.target.value);
    }

    function handleChange(amount, addonName, index) {
        if(boxesChecked[index] === false) {
            var newBoxeArr = boxesChecked;
            newBoxeArr[index] = true;
            setBoxesChecked(newBoxeArr);
            var newPrice = totalPrice + amount;
            setTotalPrice(newPrice);
            let newItem = {name : addonName, price: amount};
            let newArr = foodAddonsByBuyer;
            newArr.push(newItem);
            setFoodAddonsByBuyer(newArr);
        }
        else if(boxesChecked[index] === true) {
            var newBoxeArr = boxesChecked;
            newBoxeArr[index] = false;
            setBoxesChecked(newBoxeArr);
            boxesChecked[index] = false;
            var newPrice  = totalPrice - amount;
            setTotalPrice(newPrice);
            let newArr = foodAddonsByBuyer.filter( item => item.name != addonName);
            setFoodAddonsByBuyer(newArr);
        }
        // console.log(foodAddonsByBuyer ,totalPrice);
    }

    // Handling the form submission
    const createOrderSubmit = () => {
        var newTotalPrice = totalPrice + item.price * quantity;
        const timeT = new Date();
        var timeOfOrder = timeT.toLocaleTimeString('it-IT');

        console.log(newTotalPrice, timeOfOrder, foodAddonsByBuyer);

        if (timeOfOrder < item.creator.openingTime || timeOfOrder > item.creator.closingTime) {
            alert("Shop is closed, order other time");
            return;
        }

        fetch("http://localhost/api/orders/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("jwt_token")
            },
            body: JSON.stringify({
                name: item.name,
                itemid: item._id,
                quantity,
                vendor: item.creator._id,
                buyer: data.userData._id,
                shopName: item.shopName,
                totalPrice : newTotalPrice,
                rating: item.rating,
                orderTime: timeOfOrder,
                status: "PLACED",
                foodAddons: foodAddonsByBuyer
            })
        }).then((response) => {
            if (response.error || response.status != 200) {
                console.log(response.error);
                alert("Oops, Something went wrong!!", response.error);
                // setError(response.error);
            }
            else {
                alert("Successfully ordered food");
                //move to login window
                window.location.replace("http://localhost:3000/buyers/orders");
            }
        }).catch(error => {
            alert("Oops, Something went wrong!!");
            if (error) {
                console.log(error);
                // setError(error);
            }
        });

    };

    const handleFavClick = (foodID) => {
        fetch("http://localhost/api/buyers/favorites", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("jwt_token")
            },
            body: JSON.stringify({
                foodId: foodID
            })
        }).then((response) => {
            if (response.error || response.status != 200) {
                console.log(response)
            }
            else {
                alert("Successfully added to favorites");
                window.location.replace("http://localhost:3000/buyers/fav");
            }
        }).catch(error => {
            alert("Oops, Something went wrong!!");
            if (error) {
                console.log(error);
            }
        });
    };

    let errors = validate(quantity);
    return (<div>
        <BuyerNavBar />
        {item === undefined || item === null ? "Loading is in process" :
            <div align="" className='container'>
                <h1 style={{ margin: "5% auto" }}>Create an order</h1>
                <Card sx={{ maxWidth: 545 }} style={{ backgroundColor: "#ffda3c", margin: "3% 0%", padding: "2%" }}>
                    <CardActionArea>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={1}>

                                <Typography gutterBottom variant="h8" component="div">
                                    Name: {item.name}
                                </Typography>

                                <IconButton aria-label="favorite" size="large">
                                    <FavoriteIcon fontSize="inherit" style={{ color: "#0896da" }} onClick={() => handleFavClick(item._id)} />
                                </IconButton>

                            </Stack>

                            {/* <Stack direction="row" alignItems="center" spacing={10}> */}
                            <Typography gutterBottom variant="h8" component="div">
                                Price: {item.price}
                            </Typography>

                            <Typography gutterBottom variant="h8" component="div">
                                Category: {item.category}
                            </Typography>

                            <Typography gutterBottom variant="h8" component="div">
                                Shop Name: {item.shopName}
                            </Typography>

                            <Typography gutterBottom variant="h8" component="div">
                                Vendor Name: {item.creator.name}
                            </Typography>

                            <Typography gutterBottom variant="h8" component="div">
                                Rating: {item.rating}
                            </Typography>
                            {/* </Stack> */}


                            <Typography gutterBottom variant="h8" component="div">
                                {/* Tags: */}

                                <Stack direction="row" spacing={2}>
                                    {
                                        item.tags.map((tagItem) => {
                                            return (
                                                <Typography gutterBottom variant="h8" component="div" style={{ background: "#fff9c4", margin: "3px", padding: "1%", borderRadius: "7px", fontSize: "12.5px" }}>
                                                    {tagItem}
                                                </Typography>
                                            )
                                        })
                                    }
                                </Stack>
                            </Typography>

                            {(item.foodAddons.length != 0) ?
                                <div>
                                    <h1></h1>
                                    <Typography gutterBottom variant="h8" component="div">
                                        Food Addons:
                                    </Typography>
                                    {
                                        item.foodAddons.map((addOnItem, index) => {
                                            return (
                                                <div>
                                                    <Stack direction="row" spacing={1}>
                                                        <Typography gutterBottom variant="h8" component="div" style={{ background: "#fff9c4", margin: "5px auto 3px 0px", padding: "1%", borderRadius: "7px", fontSize: "12.5px" }}>
                                                            {addOnItem.name}, Rs {addOnItem.price}
                                                        </Typography>
                                                        <Checkbox {...label} id={index} onChange = {() => handleChange(addOnItem.price, addOnItem.name,index)} />
                                                    </Stack>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                :
                                <div></div>

                            }
                            <Form>
                            <FormGroup row>
                                <Label htmlFor="quantity" md={2}>Quantity</Label>
                                <Col md={10}>
                                    <Input type="number" id="quantity" name="quantity"
                                        value={quantity}
                                        placeholder="Enter quantity"
                                        onChange={handleQuantity}
                                        valid={errors.quantity === ''}
                                        invalid={errors.quantity !== ''}
                                    />
                                    <FormFeedback>{errors.quantity}</FormFeedback>
                                </Col>
                            </FormGroup>
                            </Form>

                            <div align="center" style={{ padding: "5% 0% 0% 0%" }}>
                                <LoadingButton
                                    color="secondary"
                                    onClick={() => createOrderSubmit()}
                                    loadingPosition="start"
                                    startIcon={<AddShoppingCartIcon />}
                                    variant="contained"
                                >
                                    Confirm Order
                                </LoadingButton>
                            </div>

                        </CardContent>
                    </CardActionArea>
                </Card>
            </div>
        }

    </div>)
}

export default ShoppingCart;
