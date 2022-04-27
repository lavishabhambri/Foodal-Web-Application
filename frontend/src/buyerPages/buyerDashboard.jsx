import React, {useContext, useEffect} from 'react';
import UserContext from '../context/userContext';
import { returnLocalStorage } from "../components/LocalStorageHelper";
import BuyerNavBar from './BuyerNavbar';
import axios from 'axios';
import BuyerDetails from './BuyerDetails';

function BuyerDashboard() {

    const { data, setData } = useContext(UserContext);
    const loginDetails = returnLocalStorage();

    console.log(data);
    console.log(loginDetails.token, loginDetails.userType);

    
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
                            "Content-Type": "application/json"
                        },
                    })
                    .then((res) => {
                        console.log(res.data);
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
        <div>
            <BuyerNavBar></BuyerNavBar>
            <div align="center" style={{margin:"40px"}}>
                <BuyerDetails></BuyerDetails>
            </div>
            
        </div>
    )
}

export default BuyerDashboard;

