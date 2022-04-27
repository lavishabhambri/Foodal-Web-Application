import React, {useContext, useEffect} from 'react';
import UserContext from '../context/userContext';
import { returnLocalStorage } from "./LocalStorageHelper";
import VendorNavBar from '../Layout/VendorDashboardNavbar';
import VendorDetails from '../Layout/VendorDetails';
import axios from 'axios';

function VendorDashboard() {

    const { data, setData } = useContext(UserContext);
    const loginDetails = returnLocalStorage();

    console.log(data);
    console.log(loginDetails.token, loginDetails.userType);

    // we only need to fetch and setData data when we need to make any new change into 
    //below fetching not required

    let path = null;
    if (loginDetails.userType == "buyer")
        path = "buyers"
    else if (loginDetails.userType == "vendor")
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
            <VendorNavBar></VendorNavBar>
            <div align="center" style={{margin:"40px"}}>
                <VendorDetails></VendorDetails>
            </div>
            
        </div>
    )
}

export default VendorDashboard;
