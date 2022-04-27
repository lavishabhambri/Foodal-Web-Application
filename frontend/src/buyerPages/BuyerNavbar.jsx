import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { deleteLocalStorage, setLocalStorage, returnLocalStorage } from '../components/LocalStorageHelper';
import { useContext } from 'react';
import UserContext from '../context/userContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const BuyerNavBar = () => {
  const {data, setData} = useContext(UserContext);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };

    const handleDashboard = () => {
        window.location.replace("/buyers/dashboard");
    };

    const handleEditProfile = () => {
        window.location.replace("/buyers/editprofile");
    };

    const handleLogout = () => {
        deleteLocalStorage();
        window.location.replace("/");
    };

    const handleFoodMenu = () => {
      window.location.replace("/buyers/menu");
      setAnchorElUser(null);
    };


    const handleOrderedFood = () => {
      window.location.replace("/buyers/orders");
      setAnchorElUser(null);
    };

    const handleFavorites = () => {
      window.location.replace("/buyers/fav");
      setAnchorElUser(null);
    };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            Foodal
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {/* ['Food Menu', 'Add items', 'Received Orders']; */}


                <MenuItem key={'Food Menu'} onClick={handleFoodMenu}>
                  <Typography textAlign="center">{'Food menu'}</Typography>
                </MenuItem>

                <MenuItem key={'Your orders'} onClick={handleOrderedFood}>
                  <Typography textAlign="center">{'Your orders'}</Typography>
                </MenuItem>
                
                <MenuItem key={'Your favorites'} onClick={handleFavorites}>
                  <Typography textAlign="center">{'Your favorites'}</Typography>
                </MenuItem>

                {data.userData != null ? 
                <MenuItem key={'Your favorites'} >
                  <Typography textAlign="center" onClick={handleDashboard} style={{color:"yellow"}}>{'Wallet money' + data.userData.walletMoney}</Typography>
                </MenuItem>                
                :""}

            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                key="food-menu"
                onClick={handleFoodMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Food menu
              </Button>
              <Button
                key="recieved-orders"
                onClick={handleOrderedFood}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Your orders
              </Button>

              <Button
                key="favorites-orders"
                onClick={handleFavorites}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Your favorites
              </Button>

              {data.userData != null ?      
              <Button
                key="recieved-orders"
                onClick={handleDashboard}
                sx={{ my: 2, color: 'yellow', display: 'block' }}
              >
                Wallet money {data.userData.walletMoney}
              </Button>
              : ""}
          </Box>

          
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} style={{color:"white"}}>
                <AccountCircleIcon/>
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
                <MenuItem key={0} onClick={handleDashboard}>
                  <Typography textAlign="center">Dashboard</Typography>
                </MenuItem>

                <MenuItem key={1} onClick={handleEditProfile}>
                  <Typography textAlign="center">Edit Profile</Typography>
                </MenuItem>

                <MenuItem key={2} onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>

            </Menu>
          </Box>
        </Toolbar>

      </Container>
    </AppBar>
  );
};
export default BuyerNavBar;
