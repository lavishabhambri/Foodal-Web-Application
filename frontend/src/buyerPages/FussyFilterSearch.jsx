import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { returnLocalStorage } from "../components/LocalStorageHelper";
import BuyerNavBar from './BuyerNavbar';
import Stack from '@mui/material/Stack';
import { Form, FormGroup, Label, Input, Col } from 'reactstrap';
import Fuse from "fuse.js";
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import LoadingButton from '@mui/lab/LoadingButton';


function ItemsMenu() {
    // const navigate = useNavigate();
    const [foodM, setfoodMenu] = useState(null)
    const tokenData = returnLocalStorage().token;
    const [error, setError] = useState(null);
    const [myOptions, setMyOptions] = useState([]);

    const timeT = new Date();
    var timeOfOrder = timeT.toLocaleTimeString('it-IT');
    const [currTime, setCurrTime] = useState(timeOfOrder);
    const [unavailableFood, setUnavailableFood] = useState(null);

    const addItemToUnavailable = (item) => {
        let newUnavailableList;
        if (unavailableFood != null)
            newUnavailableList = unavailableFood;
        else
            newUnavailableList = [];
        newUnavailableList.push(item);
        setUnavailableFood(newUnavailableList);
    }

    useEffect(() => {
        axios.get("http://localhost/api/fooditems/", {
            headers: {
                "Authorization": tokenData,
            },
        })
            .then((res) => {
                // console.log(res.data);
                let foodArr = res.data;
                let newArrUnavailable = [];
                let newArrAvailable = [];

                foodArr.map(item => {
                    if (item.creator.openingTime < currTime && item.creator.closingTime > currTime) {
                        newArrAvailable.push(item);
                    }
                    else {
                        newArrUnavailable.push(item);
                    }
                })
                setUnavailableFood(newArrUnavailable);
                setfoodMenu(newArrAvailable);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);


    // Handling the form submission
    const handleFavClick = (foodID) => {
        fetch("http://localhost/api/buyers/favorites", {
            method: "PATCH",
            headers: {
                "Authorization": tokenData,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                foodId: foodID
            })

        // axios.patch("http://localhost/api/buyers/favorites", {
        //     headers: {
        //             "Authorization": tokenData,
        //             "Content-Type": "application/json",
        //             "Access-Control-Request-Method": "PATCH",
        //             "Access-Control-Request-Headers": "Content-Type"
        //         },
        //         body: JSON.stringify({
        //             foodId: foodID
        //         })
        }).then((response) => {
            if (response.error || response.status != 200) {
                console.log(response)
                setError(response.error);
            }
            else {
                alert("Successfully added to favorites");
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

    const [searchData, setSearchData] = useState(foodM);

    const handleSearch = (query) => {
        if (!query) {
            setSearchData(foodM);
            return;
        }
        const fuse = new Fuse(foodM, {
            keys: ["name"]
        });
        const result = fuse.search(query);
        const finalResult = [];
        if (result.length) {
            result.forEach((item) => {
                finalResult.push(item.item);
            });
            setSearchData(finalResult);
        } else {
            setSearchData([]);
        }
    };

    return (
        <div>
            <BuyerNavBar />
            <div className="container" style={{ margin: "5% auto" }}>
                <div>
                    <Form>
                        <FormGroup row>
                            <Label htmlFor="search" md={2}>Search food</Label>
                            <Col md={10}>
                                <Input id="search" name="search"
                                    placeholder="Search..."
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </Col>
                        </FormGroup>
                    </Form>
                </div>
                {searchData === null ?
                    <div>
                        {foodM === null ? "Loading items..." :
                            <div align="left">
                                <h1 style={{ margin: "5% auto" }}>Food Menu</h1>

                                {foodM.map((item, index) => {
                                    console.log(item)
                                    return (
                                        <div>
                                            <Card sx={{ maxWidth: 445 }} style={{ backgroundColor: "#ffda3c", margin: "3% 0%", padding: "2%" }}>
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
                                                        <div style={{ padding: "5% 0% 0% 0%" }}>
                                                            <Link to={{ pathname: "/buyers/orderfood", state: item }} style={{padding: "2.45%", background:"blue", color: "white", borderRadius:"5px", marginLeft:"10px", fontSize:"14px", textDecoration:"none"}}
                                                            > CHECKOUT
                                                            </Link>
                                                        </div>

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

                    :
                    <div align="left">
                        <h1 style={{ margin: "5% auto" }}>Food Menu</h1>

                        {searchData.map((item, index) => {
                            return (
                                <div>
                                    {console.log(item)}
                                    <Card sx={{ maxWidth: 445 }} style={{ backgroundColor: "#ffd54f", margin: "3% 0%", padding: "2%" }}>
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

                                                <div style={{ padding: "5% 0% 0% 0%" }}>
                                                  
                                                    <Link to={{ pathname: "/buyers/orderfood", state: item }} style={{padding: "2.45%", background:"blue", color: "white", borderRadius:"5px", marginLeft:"10px", fontSize:"14px", textDecoration:"none"}}
                                                    > CHECKOUT
                                                    </Link>
                                                </div>

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
            <div className='container'>
                {unavailableFood === null  || unavailableFood.length === 0 ? "" :
                <div>
                    <h1 style={{ margin: "5% auto" }}>Unavailable food items shops are closed</h1>
                    {unavailableFood.map((item, index) => {
                        console.log(item)
                        return (
                            <div>
                                <Card sx={{ maxWidth: 445 }} style={{ backgroundColor: "#ffda3c", margin: "3% 0%", padding: "2%" }}>
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
                        )
                    })
                    } </div>
                }
                
            </div>
        </div>
    )
}

export default ItemsMenu