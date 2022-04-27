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
import { CardActionArea, skeletonClasses } from '@mui/material';
import { returnLocalStorage } from "../components/LocalStorageHelper";
import VendorNavBar from "../Layout/VendorDashboardNavbar";
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {Link} from 'react-router-dom';

function FoodMenu() {
    // const { data, setData } = useContext(UserContext);
    const [foodM, setfoodMenu] = useState(null)
    const tokenData = returnLocalStorage().token;
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://localhost/api/fooditems/myfooditems", {
            headers: {
                "Authorization": tokenData,
            },
        })
            .then((res) => {
                console.log(res.data);
                setfoodMenu(res.data);
                // console.log(foodMenu);
                // const newData = data;
                // data.foodMenuItems = res.data;
                // setData({
                //     data
                // });
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    function deleteFoodItem(id) {
        axios.delete("http://localhost/api/fooditems/"+ id, {
            headers: {
                "Authorization": tokenData,
            },
        })
            .then((res) => {
                if (res.error || res.status != 200) {
                    console.log(res)
                    setError(res.error);
                    alert(res.error);
                }
                else {
                    alert("Item deleted successfully!");
                    window.location.replace("http://localhost:3000/vendors/menu"); 
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
                                            Category: {item.category}
                                        </Typography>

                                        {/* <Stack direction="row" alignItems="center" spacing={10}> */}
                                        <Typography gutterBottom variant="h8" component="div">
                                            Price: {item.price}
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

                                            <div >
                                                

                                                
                                                <div style={{ padding: "5% 0% 0% 0%" }}>
                                                    <Button color="primary" onClick={() => deleteFoodItem(item._id)} style={{ background: "#ff5252", color: "white", marginRight:"10px"}}>
                                                        Delete Item
                                                    </Button>

                                                    <Link to={{
                                                        pathname: "/vendors/editfood", 
                                                        state: item
                                                    }} style={{padding: "2.45%", background:"blue", color: "white", borderRadius:"5px", marginLeft:"10px", fontSize:"14px", textDecoration:"none"}}
                                                    >EDIT ITEM
                                                    </Link>

                                                </div>
                                            </div>

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

export default FoodMenu
