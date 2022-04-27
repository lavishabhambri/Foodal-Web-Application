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
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';


function BuyerFavorites() {
    // const { data, setData } = useContext(UserContext);
    // console.log(data.userData.favorites);
    const [error, setError] = useState('');

    const [foodM, setfoodMenu] = useState(null)
    const tokenData = returnLocalStorage().token;

    // if(data.userData != null) {
    //     setfoodMenu(data.userData.favorites);
    // }

    useEffect(() => {
        fetch("http://localhost/api/buyers/favorites", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": tokenData
            },
        }).then((response) => {
            if (response.error || response.status != 200) {
                console.log(response)
                setError(response.error);
            }
            else {
                // alert("Successfully added to favorites");
                // window.location.replace("http://localhost:3000/buyers/favorites"); 
                // console.log(response);
                return response.json();
                // console.log(response.userData);
            }
        }).then(data =>{
            // console.log(data);   
            setfoodMenu(data.userData);   
        })
        .catch(error => {
            alert("Oops, Something went wrong!!");
            if (error) {
                console.log(error);
                setError(error);
            }
        });
    }, []);


    // Handling the form submission
    const handleRemoveFav = (foodID) => {
        fetch("http://localhost/api/buyers/favorites", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": tokenData
            },
            body: JSON.stringify({
                foodId: foodID
            })
        }).then((response) => {
            if (response.error || response.status != 200) {
                console.log(response)
                setError(response.error);
            }
            else {
                alert("Successfully removed from favorites");
                window.location.replace("http://localhost:3000/buyers/fav"); 
            }
        }).catch(error => {
            alert("Oops, Something went wrong!!");
            if (error) {
                console.log(error);
                setError(error);
            }
        });
    };


    return (
        <div>
            <BuyerNavBar />
            <div className="container" style={{ margin: "5% auto" }}>
                {(foodM === null || foodM === undefined) ? "Loading items..." :
                    <div align="left">
                        <h1 style={{ margin: "5% auto" }}>Your favorites</h1>

                        {foodM.map((item, index) => {
                                return (
                                    <div>
                                        {console.log(item)}
                                        <Card sx={{ maxWidth: 445 }} style={{ backgroundColor: "#add146", margin: "3% 0%", padding: "2%" }}>
                                            <CardActionArea>
                                                <CardContent>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                        
                                                        <Typography gutterBottom variant="h8" component="div">
                                                            Name: {item.name}
                                                        </Typography>

                                                        <IconButton aria-label="delete" size="large">
                                                                <DeleteIcon fontSize="inherit" style={{color:"#ed3f3c"}} onClick={() => handleRemoveFav(item._id)} />
                                                        </IconButton>

                                                        </Stack>

                                                    {/* <Stack direction="row" alignItems="center" spacing={10}> */}
                                                    <Typography gutterBottom variant="h8" component="div">
                                                        Price: {item.price}
                                                    </Typography>

                                                    <Typography gutterBottom variant="h8" component="div">
                                                        Shop Name: {item.shopName}
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

                                                    {/* <div >
                                            <IconButton aria-label="delete" size="large" onClick={() => deleteFoodItem(item._id)} style={{ background: "#ff5252", color: "white", marginRight: "5px" }}>
                                                <DeleteIcon />
                                            </IconButton>
                                            
                                        </div> */}
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

export default BuyerFavorites
