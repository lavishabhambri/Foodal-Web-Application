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
import Graphs from './Graphs';

function VendorStatistics() {
    const { data, setData } = useContext(UserContext);
    // console.log(data.userData);
    // const [ratedValue, setRatedValue] = useState('');
    const [foodM, setfoodMenu] = useState(null)
    const [totalOrders, setTotalOrders] = useState(null)
    const [totalPending, setTotalPending] = useState(null)
    const [totalCompleted, setTotalCompleted] = useState(null)


    const tokenData = returnLocalStorage().token;

    useEffect(() => {
        axios.get("http://localhost/api/orders/statistics", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": tokenData,
            },
        })
            .then((res) => {
                // console.log(res.data);
                setfoodMenu(res.data.topItems);
                setTotalOrders(res.data.orderPlaced);
                setTotalPending(res.data.orderPending);
                setTotalCompleted(res.data.orderCompleted);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);


    return (
        <div>
            <VendorNavBar />
            <div className="container" style={{ margin: "5% auto" }}>
                {foodM === null ? "Loading items..." :
                    <div align="left">
                        <h1 style={{ margin: "5% auto" }}>Your orders recieved statistics</h1>
                        <div>
                            <h4 style={{ margin: "5% auto" }}>Total orders placed: {totalOrders}</h4>
                            <h4 style={{ margin: "5% auto" }}>Total orders pending: {totalPending}</h4>
                            <h4 style={{ margin: "5% auto" }}>Total orders completed: {totalCompleted}</h4>
                        </div>


                        <h2 style={{ margin: "5% auto" }}>Top 5 orders sold</h2>
                        {foodM.map((item, index) => {
                            return (
                                <div>
                                    <Card sx={{ maxWidth: 445 }} style={{ backgroundColor: "#ffd54f", margin: "3% 0%", padding: "2%" }}>
                                        <CardActionArea>
                                            <CardContent>
                                                <Typography gutterBottom variant="h8" component="div">
                                                    No. of time order placed: {item.noOfTimeOrdered}
                                                </Typography>

                                                <Typography gutterBottom variant="h8" component="div">
                                                    Food Item: {item.name}
                                                </Typography>

                                                {(item.tags.length != 0) ?
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
                                                : "" }

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
                                                    Cost: {item.price}
                                                </Typography>

                                                <Typography gutterBottom variant="h8" component="div">
                                                    Rating: {item.rating}
                                                </Typography>

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
            
            <Graphs/>


        </div>
    )
}

export default VendorStatistics;
