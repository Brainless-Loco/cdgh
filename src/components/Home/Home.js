import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import GraphicalContent from './GraphicalContent';
import TabularContent from './TabularContent';
import MapContent from './MapContent';
import Button from '@mui/material/Button';
import CustomAccordion from './VisualizingOptions/CustomAccordion';


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
          fontWeight: 'bold'
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
        sx={{ backgroundColor: '#0a1b4a', }}>
        <Typography variant="h4" className="text-cyan-300" sx={{ fontFamily: 'monospace' }}>
          Chattogram Diabetic General Hospital Dashboard
        </Typography>
      </Box>

      <Box className="w-full flex h-[90vh] justify-between">

        <Box sx={{ bgcolor: '#07021a' }} className="flex  flex-col items-center flex-nowrap w-1/4 pt-4 pb-4 h-[90vh] overflow-y-auto">
          {/* <Typography variant="h4" gutterBottom>
            Visualize
          </Typography> */}
          {options.map((option) => (
            <CustomAccordion option={option} handleSelectionChange={handleSelectionChange} renderOptions={renderOptions} />
          ))}
        </Box>

        <Box className="px-1 h-[90vh] w-full overflow-y-auto">
          <Tabs className='pt-1' value={selectedTab} onChange={handleTabChange} aria-label="Main Tabs">
            {
              ["Graphical", "Tabular", "Map"].map((tab, id) => {
                return <Tab sx={{
                  backgroundColor: id === selectedTab ? "#111a40" : 'white',
                }}
                  key={id} label={tab} />
              })
            }
          </Tabs>
          <Box className="h-[90%] w-full border" sx={{ borderColor: '#0c1021' }}>
            {selectedTab === 0 && <GraphicalContent setTableRows={setTableRows} setTableCols={setTableCols} selectedValue={selectedValue} />}
            {selectedTab === 1 && <TabularContent tableRows={tableRows} tableCols={tableCols} />}
            {selectedTab === 2 && <MapContent selectedValue={selectedValue} />}
          </Box>
        </Box>
      </Box>

    </Box>
  )
}
