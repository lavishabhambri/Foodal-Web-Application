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

function ItemsMenu() {
    const [foodM, setfoodMenu] = useState(null)
    const tokenData = returnLocalStorage().token;
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://localhost/api/fooditems/", {
            headers: {
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


return (
    <div>
        <BuyerNavBar />
        <div className="container" style={{ margin: "5% auto" }}>
            {foodM === null ? console.log(foodM) :
                <div align="left">
                    <h1 style={{ margin: "5% auto" }}>Food Menu</h1>
                    {foodM.map((item, index) => (
                        <div>
                            {console.log(item)}
                            <Card sx={{ maxWidth: 445 }} style={{ backgroundColor: "#ffd54f", margin: "3% 0%", padding: "2%" }}>
                                <CardActionArea>
                                    <CardContent>
                                        <Typography gutterBottom variant="h8" component="div">
                                            Name: {item.name}
                                        </Typography>

                                        <Typography gutterBottom variant="h8" component="div">
                                            Price: {item.price}
                                        </Typography>

                                        <Typography gutterBottom variant="h8" component="div">
                                            Shop Name: {item.shopName}
                                        </Typography>

                                        <Typography gutterBottom variant="h8" component="div">
                                            Rating: {item.rating}
                                        </Typography>


                                        <Typography gutterBottom variant="h8" component="div">

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
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </div>
                    ))}
                </div>
            }
        </div>
    </div>
)
}

export default ItemsMenu
