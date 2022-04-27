import React , {useState, useContext, useEffect}from 'react';
import { Button, Form, FormGroup, Label, Input, Col, FormFeedback, Card, Row , CardTitle, CardText, Modal, ModalHeader, ModalBody} from 'reactstrap';
import UserContext from '../context/userContext';
import axios from 'axios';
import VendorNavBar from '../Layout/VendorDashboardNavbar';

export default function UpdateVendor() {
    const reg= /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+.+(?:.[a-zA-Z0-9-]))$/;
    const phoneReg = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;
    
    const { data, setData } = useContext(UserContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contactNumber, setcontactNumber] = useState('');

    //vendor details
    const [shopName, setShopName] = useState('');
    const [openingTime, setOpeningTime] = useState('');
    const [closingTime, setClosingTime] = useState('');


    useEffect(()=>{
        setUpData();
    }, [])


    function setUpData() {
        axios
            .get("http://localhost/api/vendors/me", {
                headers: {
                    "Authorization": data.token,
                },
            }).then((response) => {
                console.log(response.data);
                setName(response.data.name);
                setEmail(response.data.email);
                setShopName(response.data.shopName);
                setcontactNumber(response.data.contactNumber);
                setOpeningTime(response.data.openingTime);
                setClosingTime(response.data.closingTime);
        }).catch(error => {
            alert("Oops, Something went wrong!!");
            if (error) {
                console.log(error.response);
            }
        });
    }

    function validate(name,email, password,contactNumber, shopName, openingTime, closingTime) {

        const errors={
            name:'',
            email: '',
            password: '',
            contactNumber:'',
            shopName:'',
            openingTime:'',
            closingTime:'',
        };

        // NAME
        if((name.length === 0)){
            errors.name='Name is required';
        }

        // EMAIL
        if (email.length === 0)
            errors.email = 'Email is required';
        else if(!reg.test(email)){
            errors.email='Invalid Email';
        }

        // PASSWORD
        if((password.length===0)){
            errors.password='Password is required';
        }

        // Phone number
        if (contactNumber.length === 0)
            errors.contactNumber = 'Contact number is required';
        else if(!phoneReg.test(contactNumber)){
            errors.contactNumber='Contact number is incorrect';
        } 

        if (shopName.length === 0)
            errors.shopName = 'Shop name is required';
        
        if (openingTime.length === 0)
            errors.openingTime = 'Shop opening time is required';

        if (closingTime.length === 0)
            errors.closingTime = 'Shop closing time is required';
        else if (closingTime <= openingTime)
            errors.closingTime = 'Invalid closing time';
        return errors;
    }


    // States for checking the errors
    const [error, setError] = useState(null);

    // Handling the name change
    const handleName = (e) => {
        setName(e.target.value);
    };

    // Handling the email change
    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    // Handling the password change
    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleContactNumber = (e) => {
        setcontactNumber(e.target.value);
    };

    const handleShopName = (e) => {
        setShopName(e.target.value);
    };

    const handleOpeningTime = (e) => {
        setOpeningTime(e.target.value);
    };

    const handleClosingTime = (e) => {
        setClosingTime(e.target.value);
    };


    // Handling the form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost/api/vendors/me", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("jwt_token")
            },
            body: JSON.stringify({
                name,
                email,
                contactNumber,
                shopName,
                openingTime,
                closingTime
            })
        }).then((res) => {
            if (res.error || res.status != 200) {
                alert("Cannot update vendor, email already exist!");
                setError(res.error);
            }
            else {
                alert("Successfully updated");
                //move to login window
                window.location.replace("http://localhost:3000/vendors/dashboard"); 
            }
        }).catch(error => {
            alert("Oops, Something went wrong!!");
            if (error) {
                console.log(error);
                setError(error);
            }
        });
    };

    let errors = validate(name,email, password,contactNumber, shopName, openingTime, closingTime);

    
    
    return (
        <div>
        <VendorNavBar />

        { data.userData === null ? "Loading..." :
    
        <div className="container" style={{margin:"5% auto"}}>
            <div className="row row-content">
                <div className="col-12 col-md-9">
                    <Form>
                        
                    <FormGroup row>
                        <Label htmlFor="name" md={2}>Name</Label>
                        <Col md={10}>
                            <Input type="name" id="name" name="name"
                            value={name}
                            placeholder={"Enter name"}
                            onChange={handleName}
                            valid={errors.name === ''}
                            invalid={errors.name !== ''}
                            />
                            <FormFeedback>{errors.name}</FormFeedback>
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label htmlFor="email" md={2}>Email</Label>
                        <Col md={10}>
                            <Input type="email" id="email" name="email"
                            value={email}
                            placeholder={data.userData.email}
                            onChange={handleEmail}
                            valid={errors.email === ''}
                            invalid={errors.email !== ''}
                            />
                            <FormFeedback>{errors.email}</FormFeedback>
                        </Col>
                    </FormGroup>


                    <FormGroup row>
                        <Label htmlFor="contactNumber" md={2}>Contact Number</Label>
                        <Col md={10}>
                            <Input type="contactNumber" id="contactNumber" name="contactNumber"
                            value={contactNumber}
                            placeholder={data.userData.contactNumber}
                            onChange={handleContactNumber}
                            valid={errors.contactNumber === ''}
                            invalid={errors.contactNumber !== ''}
                            />
                            <FormFeedback>{errors.contactNumber}</FormFeedback>
                        </Col>
                    </FormGroup>

                   <div>

                            <FormGroup row>
                                <Label htmlFor="shopName" md={2}>Shop Name</Label>
                                <Col md={10}>
                                    <Input type="shopName" id="shopName" name="shopName"
                                    value={shopName}
                                    placeholder="Enter shopName"
                                    onChange={handleShopName}
                                    valid={errors.shopName === ''}
                                    invalid={errors.shopName !== ''}
                                    />
                                    <FormFeedback>{errors.shopName}</FormFeedback>
                                </Col>
                            </FormGroup>


                            <FormGroup row>
                                <Label htmlFor="openingTime" md={2}>Opening Time</Label>
                                <Col md={10}>
                                    <Input type="openingTime" id="openingTime" name="openingTime"
                                    value={openingTime}
                                    placeholder="Enter opening time"
                                    onChange={handleOpeningTime}
                                    valid={errors.openingTime === ''}
                                    invalid={errors.openingTime !== ''}
                                    />
                                    <FormFeedback>{errors.openingTime}</FormFeedback>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label htmlFor="closingTime" md={2}>Closing Time</Label>
                                <Col md={10}>
                                    <Input type="closingTime" id="closingTime" name="closingTime"
                                    value={closingTime}
                                    placeholder="Enter closing time"
                                    onChange={handleClosingTime}
                                    valid={errors.closingTime === ''}
                                    invalid={errors.closingTime !== ''}
                                    />
                                    <FormFeedback>{errors.closingTime}</FormFeedback>
                                </Col>
                            </FormGroup>
                        </div>
                
                        <Button onClick={handleSubmit} className="btn" color="primary" type="submit"> Update</Button>
                    </Form>
                </div>
            </div>
        </div>
    }</div>

    );
}