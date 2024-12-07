import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import GraphicalContent from './GraphicalContent';
import TabularContent from './TabularContent';
import MapContent from './MapContent';
import Button from '@mui/material/Button';


export default function Home() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedValue, setSelectedValue] = useState('');
  
  const [tableRows, setTableRows] = useState([]);
  const [tableCols, setTableCols] = useState([]);

  const handleTabChange = (event, newValue) => {
      setSelectedTab(newValue);
  };


  const [options] = useState([
    {
      category: 'Location',
      levels: [
        { label: 'Overall in Bangladesh', value: 'location-overall-bangladesh' },
        { label: 'Division', value: 'location-division' },
        { label: 'District', value: 'location-district' },
        { label: 'Chittagong District', value: 'location-chittagong-district' },
        {
          label: 'Chittagong City Corporation',
          value: 'location-chittagong-city',
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
        // { label: 'Chittagong City Corporation', value: 'sex-chittagong-city' },
      ],
    },
    {
      category: 'Time',
      levels: [
        { label: 'Month', value: 'time-month' }, // Line Graph
        { label: 'WeekDay', value: 'time-weekday' }, // Bargraph
      ],
    },
    {
      category: 'Age',
      levels: [
        { label: 'Overall in Bangladesh', value: 'age-overall-bangladesh' },
        { label: 'Division Wise', value: 'age-division-wise' },
        { label: 'Subdistrict Wise (Chittagong District)', value: 'age-chittagong-district' },
        { label: 'Chittagong City Corporation', value: 'age-chittagong-city' },
      ],
    },
    {
      category: 'Physical Metrics',
      levels: [
        { label: 'BMI Distribution', value: 'physical-bmi-distribution' },
        { label: 'Height Range', value: 'physical-height-range' },
        { label: 'Weight Range', value: 'physical-weight-range' },
      ],
    },
  ]);

  // Handle selection
  const handleSelectionChange = (value) => {
    setSelectedValue(value)
  };

  // Handle selection
  const handleButtonClick = (value) => {
    setSelectedValue(value);
  };

  // Recursive renderer for nested levels
  const renderOptions = (levels, parentIndent = 0) => {
    return levels.map((level) => (
      <Button
        key={level.value}
        variant={selectedValue === level.value ? 'contained' : 'outlined'}
        onClick={() => handleButtonClick(level.value)}
        sx={{
          margin: '4px',
          minWidth: '200px',
          display: 'block',
          textAlign: 'left',
          fontWeight:'bold'
        }}
      >
        {level.label}
      </Button>
    ));
  };

  useEffect(() => {
    setTableRows([])
    setTableCols([])
    setSelectedTab(0)
  }, [selectedValue])
  

  return (
    <Box>
        <Helmet>
            <title>CDGH | BIKE Lab</title>
            <meta name="description" content="Welcome to the Visualization of CDGH Data by BIKE Lab" />
        </Helmet>
        <Box
            className="h-[10vh] flex justify-center items-center"
            sx={{
              position: 'relative',
              backgroundColor: 'white', // Optional: Background color
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Optional: Subtle shadow
              '::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '40px', // Adjust to control the fog effect height
                background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))',
                pointerEvents: 'none', // Ensures it doesn’t block clicks
              },
            }}
          >
            <Typography variant="h4" className="text-cyan-700">
              Chattogram Diabetic General Hospital Dashboard
            </Typography>
          </Box>

      <Box className="w-full flex h-[90vh] gap-1 px-3">
        
        <Box className="w-1/4 border-r-cyan-700 pr-2 border-r h-[90vh] overflow-y-auto">
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
        
            <Box className="border-l-cyan-700 pl-2 border-l h-[90vh] w-full overflow-y-auto">
              <Tabs value={selectedTab} onChange={handleTabChange} aria-label="Main Tabs">
                  <Tab label="Graphical" />
                  <Tab label="Tabular" />
                  <Tab label="Map" />
              </Tabs>
              <Box className="h-[90%] w-full">
                  {selectedTab === 0 && <GraphicalContent setTableRows={setTableRows} setTableCols={setTableCols} selectedValue={selectedValue}/>}
                  {selectedTab === 1 && <TabularContent tableRows={tableRows} tableCols={tableCols}/>}
                  {selectedTab === 2 && <MapContent selectedValue={selectedValue}/>}
              </Box>
        </Box>
      </Box>
        
    </Box>
  )
}
