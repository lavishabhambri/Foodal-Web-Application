import React , {useState, useContext, useEffect}from 'react';
import { Button, Form, FormGroup, Label, Input, Col, FormFeedback, Card, Row , CardTitle, CardText, Modal, ModalHeader, ModalBody} from 'reactstrap';
import UserContext from '../context/userContext';
import axios from 'axios';
import BuyerNavBar from './BuyerNavbar';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

export default function UpdateBuyer() {
    const reg= /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+.+(?:.[a-zA-Z0-9-]))$/;
    const phoneReg = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;
    
    const { data, setData } = useContext(UserContext);
    const possibleBatches = ['UG1', 'UG2', 'UG3', 'UG4', 'UG5']

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setcontactNumber] = useState('');
    const [age, setAge] = useState('');
    const [batch, setBatch] = useState('');

    useEffect(()=>{
        setUpData();
    }, [])


    function setUpData() {
        axios
            .get("http://localhost/api/buyers/me", {
                headers: {
                    "Authorization": data.token,
                },
            }).then((response) => {
                console.log(response.data);
                setName(response.data.name);
                setEmail(response.data.email);
                setcontactNumber(response.data.contactNumber);
                setAge(response.data.age);
                setBatch(response.data.batch);
        }).catch(error => {
            alert("Oops, Something went wrong!!");
            if (error) {
                console.log(error.response);
            }
        });
    }

    function validate(name,email, contactNumber,age) {

        const errors={
            name:'',
            email: '',
            contactNumber:'',
            age:''
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


        // Phone number
        if (contactNumber.length === 0)
            errors.contactNumber = 'Contact number is required';
        else if(!phoneReg.test(contactNumber)){
            errors.contactNumber='Contact number is incorrect';
        } 

        if (age <= 0)
            errors.age = 'Age is required';
        
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

    const handleContactNumber = (e) => {
        setcontactNumber(e.target.value);
    };

    const handleAge = (e) => {
        setAge(e.target.value);
    };

    const handleBatch = (e) => {
        setBatch(e.value);
    };


    // Handling the form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost/api/buyers/me", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("jwt_token")
            },
            body: JSON.stringify({
                name,
                email,
                contactNumber,
                age,
                batch
            })
        }).then((response) => {
            if (response.error || response.status != 200) {
                // console.log(response)
                alert("Buyer with similar email already exist, cannot update buyer!");
                setError(response.error);
            }
            else {
                alert("Successfully updated");
                //move to login window
                window.location.replace("http://localhost:3000/buyers/dashboard"); 
            }
        }).catch(error => {
            alert("Oops, Something went wrong!!");
            if (error) {
                console.log(error);
                setError(error);
            }
        });
    };

    let errors = validate(name,email,contactNumber, age);

    
    
    return (
        <div>
        <BuyerNavBar />

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
                
                        <Button onClick={handleSubmit} className="btn" color="primary" type="submit"> Update</Button>
                    </Form>
                </div>
            </div>
        </div>
    }</div>

    );
}