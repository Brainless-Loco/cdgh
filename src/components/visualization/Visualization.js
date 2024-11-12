import React, { useState } from 'react'
import './Visualization.css'
import { Helmet } from 'react-helmet'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import MyGoogleMap from './MyGoogleMap'
import { Typography } from '@mui/material'


export default function Visualization() {

    const [selectedCategory, setSelectedCategory] = useState('')

    const handleChange = (e) => {
        console.log(e.target.value)
        setSelectedCategory(e.target.value);
    };


    return (
        <div>
            <Helmet>
                <title>Map Visualization</title>
            </Helmet>
            <Box className='w-full text-center mb-5'>
                <Typography variant='h4' >Geographic representations of patients in 2024.</Typography>
            </Box>
            {/* <Box className="w-full text-center">
                <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">Select a category to visualize</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        onChange={handleChange}
                        value={selectedCategory}
                    >
                        <FormControlLabel value="ageGroup" control={<Radio />} label="Age Group" />
                        <FormControlLabel value="sex" control={<Radio />} label="Sex" />
                        <FormControlLabel value="location" control={<Radio />} label="Location" />
                    </RadioGroup>
                </FormControl>
            </Box> */}
            <Box className="flex justify-center rounded-3xl overflow-hidden">
                <MyGoogleMap/>
            </Box>
            
        </div>
    )
}
