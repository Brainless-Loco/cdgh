import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Home() {

  const [selectedValue, setSelectedValue] = useState('');

  const [options] = useState([
    {
      category: 'Location',
      levels: [
        { label: 'Overall in Bangladesh', value: 'overall-bangladesh' },
        { label: 'Division', value: 'division' },
        { label: 'District', value: 'district' },
        { label: 'Chittagong District', value: 'chittagong-district' },
        {
          label: 'Chittagong City Corporation',
          value: 'chittagong-city',
        },
      ],
    },
    {
      category: 'Sex',
      levels: [
        { label: 'Overall in Bangladesh', value: 'sex-overall-bangladesh' },
        { label: 'Division Wise', value: 'sex-division-wise' },
        {
          label: 'Chittagong District (Subdistrict Wise)',
          value: 'sex-chittagong-district',
        },
        { label: 'Chittagong City Corporation', value: 'sex-chittagong-city' },
      ],
    },
    {
      category: 'Time',
      levels: [
        { label: 'Month', value: 'month' }, // Line Graph
        { label: 'WeekDay', value: 'weekday' }, // Bargraph
      ],
    },
    {
      category: 'Age',
      levels: [
        { label: 'Overall in Bangladesh', value: 'p-age-overall-bangladesh' },
        { label: 'Division Wise', value: 'p-age-division-wise' },
        { label: 'Subdistrict Wise (Chittagong District)', value: 'c-age-chittagong-district' },
        { label: 'Chittagong City Corporation', value: 'p-age-chittagong-city' },
      ],
    },
  ]);

  // Handle selection
  const handleSelectionChange = (value) => {
    console.log(value)
  };

  // Recursive renderer for nested levels
  const renderOptions = (levels, parentIndent = 0) => {
    return levels.map((level) => (
      <div key={level.value} style={{ marginLeft: parentIndent * 20 }}>
        <FormControlLabel
          value={level.value}
          control={<Radio />}
          label={level.label}
        />
        {level.children && renderOptions(level.children, parentIndent + 1)}
      </div>
    ));
  };

  return (
    <Box>
        <Helmet>
            <title>CDGH | BIKE Lab</title>
            <meta name="description" content="Welcome to the Visualization of CDGH Data by BIKE Lab" />
        </Helmet>
      <Box className="h-[10vh] flex justify-center items-center">
        <Typography variant='h4' color='blue'>Chattogram Diabetic General Hospital Dashboard</Typography>
      </Box>
      <Box className="w-full flex h-[90vh] gap-1 px-3">
        
        <Box className="w-1/4 border-r-blue-700 pr-2 border-r h-[90vh] overflow-y-auto">
            <Typography variant="h5" gutterBottom>
            Visualization Options
          </Typography>
          {options.map((option) => (
            <Accordion key={option.category}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{option.category}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl>
                  <RadioGroup
                    name={option.category}
                    onChange={(e) => handleSelectionChange(e.target.value)}
                  >
                    {renderOptions(option.levels)}
                  </RadioGroup>
                </FormControl>
              </AccordionDetails>
            </Accordion>
          ))}
            </Box>
        
        <Box className="border-l-blue-700 pl-2 border-l h-[90vh] w-3/4  overflow-y-auto flex justify-center items-center">
          dfda
        </Box>
      </Box>
        
    </Box>
  )
}
