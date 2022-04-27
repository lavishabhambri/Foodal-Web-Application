import { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Col, FormFeedback, Alert } from 'reactstrap';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import { Link } from 'react-router-dom';

export default function Signup() {

    // States for registration
    const reg= /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+.+(?:.[a-zA-Z0-9-]))$/;
    const phoneReg = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;
    
    const options = ['Buyer', 'Vendor']
    // let defaultOption = options[0]
    const possibleBatches = ['UG1', 'UG2', 'UG3', 'UG4', 'UG5']
    const [userType, setUserType] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contactNumber, setcontactNumber] = useState('');
    
    //buyer details
    const [age, setAge] = useState();
    const [batch, setBatch] = useState('');

    //vendor details
    const [shopName, setShopName] = useState('');
    const [openingTime, setOpeningTime] = useState('');
    const [closingTime, setClosingTime] = useState('');

    function validate(name,email,userType, password,contactNumber,age, batch, shopName, openingTime, closingTime) {

        const errors={
            name:'',
            email: '',
            userType: '',
            password: '',
            contactNumber:'',
            age:'',
            batch:'',
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

        // USERTYPE
        if((userType==='')){
            errors.userType = 'Select A User Type';
        }

        // Phone number
        if (contactNumber.length === 0)
            errors.contactNumber = 'Contact number is required';
        else if(!phoneReg.test(contactNumber)){
            errors.contactNumber='Contact number is incorrect';
        } 

        // Age
        if(age <= 0){
            errors.age ='Invalid age';
        }

        if (batch.length === 0)
            errors.batch = 'Select batch';
        

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

    const handleUserType = (e) => {
        console.log(e.value);
        setUserType(e.value);
    }

    const handleContactNumber = (e) => {
        setcontactNumber(e.target.value);
    }

    const handleAge = (e) => {
        setAge(e.target.value);
    }

    const handleBatch = (e) => {
        setBatch(e.value);
    }

    const handleShopName = (e) => {
        setShopName(e.target.value);
    }

    const handleOpeningTime = (e) => {
        setOpeningTime(e.target.value);
    }

    const handleClosingTime = (e) => {
        setClosingTime(e.target.value);
    }


    // Handling the form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (userType === 'Buyer')
            fetch("http://localhost/api/buyers/signup", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    password,
                    email,
                    contactNumber,
                    age,
                    batch,
                    type: userType
                })
            }).then((response) => {
                if (response.error || response.status != 200) {
                    console.log(response)
                    setError(response.error);
                }
                else {
                    alert("Successfully registered");
                    //move to login window
                    window.location.replace("http://localhost:3000/");
                }
            }).catch(error => {
                alert("Oops, Something went wrong!!");
                if (error) {
                    console.log(error);
                    setError(error);
                }
            });
        else if (userType === 'Vendor') fetch("http://localhost/api/vendors/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                password,
                email,
                contactNumber,
                shopName,
                openingTime,
                closingTime,
                type: userType
            })
        }).then((response) => {
            if (response.error || response.status != 200) {
                console.log(response)
                setError(response.error);
            }
            else {
                alert("Successfully registered");
                //move to login window
                console.log(response);
                console.log(response.token);

                // localStorage.setItem("japStateToken", response.jwt_token);
                // localStorage.setItem("japStateType", response.type);

                window.location.replace("http://localhost:3000/");
            }
        }).catch(error => {
            alert("Oops, Something went wrong!!");
            if (error) {
                console.log(error);
                setError(error);
            }
        });
    };



    let errors = validate(name,email,userType, password,contactNumber,age, batch, shopName, openingTime, closingTime);
    return (
        <div className="container">
            <div className="row row-content">
                <div className="col-12 col-md-9">
                    <p>Already have an account? <Link to='/'><Button>Log in</Button></Link> </p>
                    <Form>
                        
                    <FormGroup row>
                        <Label htmlFor="name" md={2}>Name</Label>
                        <Col md={10}>
                            <Input type="name" id="name" name="name"
                            value={name}
                            placeholder="Enter name"
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
                            placeholder="Enter email"
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
                            placeholder="Enter contact number (+xx-xxxxxxxxxx)"
                            onChange={handleContactNumber}
                            valid={errors.contactNumber === ''}
                            invalid={errors.contactNumber !== ''}
                            />
                            <FormFeedback>{errors.contactNumber}</FormFeedback>
                        </Col>
                    </FormGroup>


                    <FormGroup row>
                        <Label htmlFor="password" md={2}>Password</Label>
                        <Col md={10}>
                            <Input type="password" id="password" name="password"
                            value={password}
                            placeholder="Enter password"
                            onChange={handlePassword}
                            valid={errors.password === ''}
                            invalid={errors.password !== ''}
                            />
                            <FormFeedback>{errors.password}</FormFeedback>
                        </Col>
                    </FormGroup>


                    <Dropdown options={options} onChange={handleUserType} value={userType} placeholder="Select an option" />

                    {(userType === "Buyer") ? (<div>

                        <FormGroup row>
                            <Label htmlFor="age" md={2}>Age</Label>
                            <Col md={10}>
                                <Input type="age" id="age" name="age"
                                value={age}
                                placeholder="Enter age"
                                onChange={handleAge}
                                valid={errors.age === ''}
                                invalid={errors.age !== ''}
                                />
                                <FormFeedback>{errors.age}</FormFeedback>
                            </Col>
                        </FormGroup>
                        

                        <FormGroup row>
                            <Label htmlFor="batch" md={2}>Batch</Label>
                            <Col md={10}>
                                <Dropdown options={possibleBatches} onChange={handleBatch} value={batch} placeholder="Select your batch" />
                                <FormFeedback>{errors.batch}</FormFeedback>
                            </Col>
                        </FormGroup>
                        </div>
                        ) : (<div>

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
                        )}
                
                        <Button onClick={handleSubmit} className="btn" color="primary" type="submit"> Submit</Button>
                    </Form>
                </div>
            </div>
        </div>

    );
}