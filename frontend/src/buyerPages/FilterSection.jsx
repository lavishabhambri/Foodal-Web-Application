import React from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import { useState } from 'react';




function FilterSection() {
    let [ activeFilter, setActiveFilter ] =  useState([]);
    const filters = {
        'Veg': '',
        'NonVeg': ''
    }
    function handleFilterVeg(value) {
        if (filters.Veg === '') {
            filters.Veg = 'Yes';
            activeFilter.push(value);
        }
        else {
            filters.Veg = '';
            activeFilter = activeFilter.filter(rv => rv != value);
        }
        
        console.log(activeFilter);
    }

    function handleFilterNonVeg(value) {
        if (filters.NonVeg === '') {
            filters.NonVeg = 'Yes';
            activeFilter.push(value);
        }
        else {
            filters.NonVeg = '';
            activeFilter = activeFilter.filter(rv => rv != value);
        }
        console.log(activeFilter);
    }

    return (
        <div>
            <Stack direction="row" alignItems="center" spacing={1}>
                <FormGroup>
                    <FormControlLabel control={<Checkbox />} label="Veg" onChange={() => handleFilterVeg("Veg")} />
                    <FormControlLabel control={<Checkbox />} label="Non Veg" onChange={() => handleFilterNonVeg("NonVeg")} />
                </FormGroup>
            </Stack>
        </div>
    )
}

export default FilterSection
