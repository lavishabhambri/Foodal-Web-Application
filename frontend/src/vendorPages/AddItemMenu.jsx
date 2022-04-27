import React, { useState, useContext } from 'react';
import { Button, Form, FormGroup, Label, Input, Col, FormFeedback } from 'reactstrap';

import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import axios from 'axios';
import { setLocalStorage, deleteLocalStorage, returnLocalStorage } from "../components/LocalStorageHelper";
import UserContext from '../context/userContext';
import VendorNavBar from "../Layout/VendorDashboardNavbar";
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

import * as P from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import * as M from "@material-ui/core";
import * as S from "./Styled";
import * as I from '@material-ui/icons';
import * as L from "@material-ui/lab";


export default function AddItemMenu() {
    const { data, setData } = useContext(UserContext);
    const [name, setName] = useState('');
    const [price, setPrice] = useState();

    const possibleCategory = ['Veg', 'Non-Veg']

    const [addOn, setAddon] = useState('');
    const [addOnPrice, setAddonPrice] = useState();
    const [foodAddons, setFoodAddOns] = useState([{ key: 0, name: 'Salad', price: 50 }]);

    const [foodCategory, setFoodCategory] = useState('Veg');
    function handleFoodCategory (e) {
        setFoodCategory(e.value);
    }

    const tokenData = returnLocalStorage().token;
    const userType = returnLocalStorage().userType;
    const [error, setError] = useState(null);

    const handleFoodAddonDelete = (AddonToDelete) => () => {
        setFoodAddOns((foodAddons) => foodAddons.filter((addOn) => addOn.key !== AddonToDelete.key))
    }

    const addAddon = () => {
        const tempFoodAddons = foodAddons
        let idx;
        if(foodAddons.length === 0)
        {
            idx = 0;
        } else 
            idx = foodAddons[foodAddons.length - 1].key + 1;
        tempFoodAddons.push({ key: idx, name: addOn, price: addOnPrice });
        setAddonPrice(0);
        setAddon("")
    }

    const handleAddon = (e) => {
        setAddon(e.target.value);
    }
    const handleAddonPrice = (e) => {
        setAddonPrice(e.target.value);
    }

    const [tag, setTag] = useState('');
    const [tagsData, setTagsData] = useState([
        { key: 0, tagName: 'Fresh' }
    ])

    const handleTagDelete = (tagToDelete) => () => {
        setTagsData((tags) => tags.filter((tag) => tag.key !== tagToDelete.key));
    };
    const addTag = () => {
        const tempTagsData = tagsData;
        let idx;
        if(tagsData.length === 0)
            idx = 0;
        else
            idx = tagsData[tagsData.length - 1].key + 1
        tempTagsData.push({ key: idx, tagName: tag });
        setTag('')
    }

    const handleTag = (e) => {
        setTag(e.target.value);
    }

    function validate(name, price, foodAddons, addOnPrice, tags) {
        const errors = {
            name: '',
            price: '',
            foodAddons: '',
            addOnPrice: '',
            tags:''
        };

        // name
        if (name.length === 0)
            errors.name = 'Name is required';

        // price
        if (price < 0) {
            errors.price = 'Price cannot be less than 0';
        }
        else if(price == 0) {
            errors.price = 'Price is required';
        }

        if (addOnPrice <= 0) {
            errors.addOnPrice = 'Price cannot be less than 0';
        }

        foodAddons.map(item => {
            if (item.name === '') {
                errors.foodAddons = 'Food addon name cannot be null';
            }
            if (item.price <= 0) {
                errors.foodAddons = 'Food addon price cannot be less than 0';
            }
        })

        tags.map( item => {
            if(item.tagName === '') {
                errors.tags = 'Tag cannot be empty';
            }
        })
        return errors;
    }


    // Handling the email change
    const handlename = (e) => {
        setName(e.target.value);
    };

    // Handling the password change
    const handlePrice = (e) => {
        setPrice(e.target.value);
    };

    const submit = async () => {

        let foodAddonArr = [];
        foodAddons.forEach((item) => {
            foodAddonArr.push({ name: item["name"], price: item["price"] });
        });

        let foodTagArr = [];
        tagsData.forEach((item) => {
            foodTagArr.push(item["tagName"]);
        });

        console.log(data.userData._id);
        await fetch("http://localhost/api/fooditems", {
            method: "POST",
            body: JSON.stringify({
                creator: data.userData._id,
                name,
                shopName: data.userData.shopName,
                price,
                category: foodCategory,
                foodAddons: foodAddonArr,
                tags: foodTagArr
            }),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": tokenData
            }
        }).then((response) => {
            if (response.error || response.status != 200) {
                console.log(response)
                setError(response.error);
            }
            else {
                alert("Item added successfully!");
                window.location.replace("http://localhost:3000/vendors/menu"); // move to dashboard
            }
        }).catch(error => {
            if (error != null || error != undefined) {
                alert(JSON.stringify(error.response));
                console.log(error);
            }
        });
    }

    let errors = validate(name, price, foodAddons, addOnPrice, tagsData);
    return (
        <div>
            <VendorNavBar />
            <div className="container" >
                <div className="row row-content">
                    <div className="col-12 col-md-9">
                        <Form style={{ marginTop: "75px" }}>
                            <FormGroup row>
                                <Label htmlFor="name" md={2}>Food name</Label>
                                <Col md={10}>
                                    <Input type="name" id="name" name="name"
                                        value={name}
                                        placeholder="Enter food name"
                                        onChange={handlename}
                                        valid={errors.name === ''}
                                        invalid={errors.name !== ''}
                                    />
                                    <FormFeedback>{errors.name}</FormFeedback>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label htmlFor="price" md={2}>Price</Label>
                                <Col md={10}>
                                    <Input type="number" id="price" name="price"
                                        value={price}
                                        placeholder="Enter food price"
                                        onChange={handlePrice}
                                        valid={errors.price === ''}
                                        invalid={errors.price !== ''}
                                    />
                                    <FormFeedback>{errors.price}</FormFeedback>
                                </Col>
                            </FormGroup>
                            
                            <FormGroup row>
                                <Label htmlFor="price" md={2}>Food category</Label>
                                <Col md={10}>
                                <Dropdown options={possibleCategory} onChange={handleFoodCategory} value={foodCategory} placeholder="Select veg or non-veg" />
                                </Col>
                            </FormGroup>
                            

                            <FormGroup row>
                                <Label htmlFor="foodAddons" md={2}>Addons</Label>
                                <Col md={10}>
                                    <Input type="text" id="foodAddons" name="foodAddons"
                                        value={addOn}
                                        placeholder="Enter addon name"
                                        onChange={handleAddon}
                                        valid={errors.foodAddons === ''}
                                        invalid={errors.foodAddons !== ''}
                                    />
                                    <FormFeedback>{errors.foodAddons}</FormFeedback>
                                </Col>
                                <Label htmlFor="foodAddons" md={2}>Addons Price</Label>
                                <Col md={10}>
                                    <Input type="number" id="addonPrice" name="addonPrice"
                                        value={addOnPrice}
                                        placeholder="Enter addon price"
                                        onChange={handleAddonPrice}
                                        valid={errors.addOnPrice === ''}
                                        invalid={errors.addOnPrice !== ''}
                                    />
                                    <FormFeedback>{errors.addOnPrice}</FormFeedback>
                                </Col>
                            </FormGroup>

                            

                            <S.Button variant="outlined" color="primary" onClick={addAddon}>Add food addon</S.Button>
                            <br />
                            <S.Paper>
                                {foodAddons.map((data) => {

                                    return (
                                        <li key={data.key}>
                                            <S.Chip
                                                label={data.name + " " + data.price}
                                                onDelete={handleFoodAddonDelete(data)}
                                            />
                                        </li>
                                    );
                                })}
                            </S.Paper>

                            <FormGroup row>
                                <Label htmlFor="foodTags" md={2}>Tags</Label>
                                <Col md={10}>
                                    <Input type="text" id="foodTags" name="foodTags"
                                        value={tag}
                                        placeholder="Enter tag"
                                        onChange={handleTag}
                                        valid={errors.tags === ''}
                                        invalid={errors.tags !== ''}
                                    />
                                    <FormFeedback>{errors.tags}</FormFeedback>
                                </Col>
                            </FormGroup>

                            <S.Button variant="outlined" color="primary" onClick={addTag}>Add tag</S.Button>
                            <br />
                            <S.Paper>
                                {tagsData.map((data) => {
                                    return (
                                        <li key={data.key}>
                                            <S.Chip
                                                label={data.tagName}
                                                onDelete={handleTagDelete(data)}
                                            />
                                        </li>
                                    );
                                })}
                            </S.Paper>

                            <FormGroup row align="center">
                                <Col md={{ size: 3, offset: 1 }}>
                                    <Button color="primary" onClick={submit}>
                                        Add Item
                                    </Button>
                                </Col>
                            </FormGroup>

                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}

