import React, {useContext, useEffect} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CallIcon from '@mui/icons-material/Call';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WorkIcon from '@mui/icons-material/Work';
import UserContext from '../context/userContext'

export default function VendorDetails() {
    const { data, setData } = useContext(UserContext);
  return (
    <div>
    { data.userData === null ? "Loading..." :
        <div>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <ListItem>
                <ListItemAvatar>
                <Avatar>
                    <AccountCircleIcon />
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Name" secondary={data.userData.name} />
            </ListItem>
            <ListItem>
                <ListItemAvatar>
                <Avatar>
                    <WorkIcon />
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Email" secondary={data.userData.email} />
            </ListItem>
            <ListItem>
                <ListItemAvatar>
                <Avatar>
                    <CallIcon />
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Contact Number" secondary={data.userData.contactNumber} />
            </ListItem>
            <ListItem>
                <ListItemAvatar>
                <Avatar>
                    <ShoppingCartIcon />
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Shop name" secondary={data.userData.shopName} />
            </ListItem>
            <ListItem>
                <ListItemAvatar>
                <Avatar>
                    <AccessTimeIcon />
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Opening time of shop" secondary={data.userData.openingTime} />
            </ListItem>
            <ListItem>
                <ListItemAvatar>
                <Avatar>
                    <AccessTimeFilledIcon />
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Closing time of shop" secondary={data.userData.closingTime} />
            </ListItem>


            </List>
        </div>
    }
    </div>
  );
}

