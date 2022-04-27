import React, { useState, useMemo, useEffect } from "react";
import { BrowserRouter, Route} from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Theme, GlobalStyle } from "./theme";
import * as T from "./muiTheme";
import axios from "axios"
import Signup from "../src/components/Signup";
import VendorDashboard from "./components/VendorDashboard";

import UserContext from "../src/context/userContext";
import { MuiThemeProvider } from "@material-ui/core";
import Login from "./components/Login";
import UpdateVendor from './components/UpdateVendor';
import FoodMenu from "./vendorPages/foodMenu";
import AddItemMenu from "./vendorPages/AddItemMenu";
import BuyerDashboard from "./buyerPages/buyerDashboard";
import UpdateBuyer from "./buyerPages/UpdateBuyer";
import ItemsMenu from "./buyerPages/FussyFilterSearch";
import BuyerFavorites from "./buyerPages/BuyerFavorites";
import ShoppingCart from "./buyerPages/ShoppingCart";
import BuyersOrders from "./buyerPages/BuyerOrder";
import VendorOrders from "./vendorPages/VendorOrders";
import EditItemMenu from "./vendorPages/EditItemMenu";
import VendorStatistics from "./vendorPages/VendorStatistics";
import Graphs from "./vendorPages/Graphs";
const previousState = {
    userType: localStorage.getItem("user_type"),
    token: localStorage.getItem("jwt_token"),
    user: {
        id: localStorage.getItem("user_id"),
        name: localStorage.getItem("user_name"),
        category: localStorage.getItem("user_category"),
    }
};

const initialState = {
    userType: previousState.userType ? previousState.userType : null,
    token: null || previousState.token,
    user: null || previousState.user,
    userData: null,
    foodMenuItems: null,
    // edVals: []
};

const App = () => {

    const [data, setData] = useState(initialState);
    const providerData = useMemo(() => ({ data, setData }), [data, setData]);
    
    let path = null;
    if (data.userType == "buyer")
        path = "buyers"
    else if (data.userType == "vendor")
        path = "vendors";

    
        useEffect(() => {
            if (path != null) {
            const userInfo = async () => {
                await axios
                    .get("http://localhost/api/" + path + "/me", {
                        headers: {
                            "Authorization": data.token,
                        },
                    })
                    .then((res) => {
                        // console.log(res);
                        setData({
                            ...data,
                            auth: "AUTHENTICATED",
                            userData: res.data
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            userInfo()
        }
    }, []);
    


    return (

        <ThemeProvider theme={Theme}>
            <MuiThemeProvider theme={T.theme}>
                <GlobalStyle />
                <BrowserRouter>
                    <UserContext.Provider value={providerData}>
                        <Route exact path="/vendors/dashboard" component={VendorDashboard} />
                        <Route exact path="/" component={Login} />
                        <Route path="/register" component={Signup} />
                        <Route path="/login" component={Login} />
                        <Route path ="/vendors/editprofile" component={UpdateVendor}/>
                        <Route path = "/vendors/menu" component={FoodMenu}></Route>
                        <Route path = "/vendors/additem" component={AddItemMenu}></Route>
                        <Route exact path ="/buyers/dashboard" component={BuyerDashboard} />
                        <Route path ="/buyers/menu" component={ItemsMenu}/>
                        <Route path ="/buyers/editprofile" component={UpdateBuyer}/>
                        <Route path ="/buyers/fav" component={BuyerFavorites}/>
                        <Route path="/buyers/orderfood" component={ (props) =><ShoppingCart {...props} />} />
                        <Route path="/buyers/orders" component={BuyersOrders} />
                        <Route path="/vendors/orders" component={VendorOrders} />
                        <Route path="/vendors/editfood" component={ (props) =><EditItemMenu {...props} />} />
                        <Route path="/vendors/statistics" component={VendorStatistics} />
                    </UserContext.Provider>
                </BrowserRouter>
            </MuiThemeProvider>
        </ThemeProvider>
    );
};

export default App;

//removed proxy
// "proxy": "http://localhost:3000",