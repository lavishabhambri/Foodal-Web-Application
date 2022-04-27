// Home -  details
// Edit details
// dispaly food menu
// Add food iteams
// Show ordered items
// Logout


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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const VendorNavBar = () => {
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
        window.location.replace("/vendors/dashboard");
    };

    const handleEditProfile = () => {
        window.location.replace("/vendors/editprofile");
    };

    const handleLogout = () => {
        deleteLocalStorage();
        window.location.replace("/");
    };

    const handleFoodMenu = () => {
      window.location.replace("/vendors/menu");
      setAnchorElUser(null);
    };

    const handleAddItems = () => {
      window.location.replace("/vendors/additem");
      setAnchorElUser(null);
    };

    const handleReceivedOrders = () => {
      window.location.replace("/vendors/orders");
      setAnchorElUser(null);
    };

    const handleStatistics = () => {
      window.location.replace("/vendors/statistics");
      setAnchorElUser(null);
    }
  
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
                  <Typography textAlign="center">{'Food Menu'}</Typography>
                </MenuItem>

                <MenuItem key={'Add items'} onClick={handleAddItems}>
                  <Typography textAlign="center">{'Add items'}</Typography>
                </MenuItem>

                <MenuItem key={'Received Orders'} onClick={handleReceivedOrders}>
                  <Typography textAlign="center">{'Received Orders'}</Typography>
                </MenuItem>

                <MenuItem key={'Orders Stats'} onClick={handleStatistics}>
                  <Typography textAlign="center">{'Statistics'}</Typography>
                </MenuItem>
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
                Food Menu
              </Button>
              <Button
                key="add-item"
                onClick={handleAddItems}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Add Items
              </Button>
              <Button
                key="recieved-orders"
                onClick={handleReceivedOrders}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Recieved Orders
              </Button>

              <Button
                key="food-statistics"
                onClick={handleStatistics}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Statistics
              </Button>
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
export default VendorNavBar;
