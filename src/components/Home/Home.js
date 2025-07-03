import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import GraphicalContent from './GraphicalContent';
import TabularContent from './TabularContent';
import MapContent from './MapContent';
import Button from '@mui/material/Button';
import CustomAccordion from './VisualizingOptions/CustomAccordion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WcIcon from '@mui/icons-material/Wc';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

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
      icon: <LocationOnIcon className='text-[#0464bc] text-xl mr-2 mt-1' />
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
      icon: <WcIcon className='text-[#0464bc] text-xl mr-2 mt-1' />
    },
    {
      category: 'Time',
      levels: [
        { label: 'Month', value: 'time-month' }, // Line Graph
        { label: 'WeekDay', value: 'time-weekday' }, // Bargraph
      ],
      icon: <CalendarTodayIcon className='text-[#0464bc] text-xl mr-2 mt-1' />
    },
    {
      category: 'Age',
      levels: [
        { label: 'Overall in Bangladesh', value: 'age-overall-bangladesh' },
        { label: 'Division Wise', value: 'age-division-wise' },
        { label: 'Subdistrict Wise (Chittagong District)', value: 'age-chittagong-district' },
        { label: 'Chittagong City Corporation', value: 'age-chittagong-city' },
      ],
      icon: <ScheduleIcon className='text-[#0464bc] text-xl mr-2 mt-1' />
    },
    {
      category: 'Overall Health Metrics',
      levels: [
        { label: 'BMI Distribution', value: 'physical-bmi-distribution' },
        { label: 'Height Range', value: 'physical-height-range' },
        { label: 'Weight Range', value: 'physical-weight-range' },
      ],
      icon: <MonitorHeartIcon className='text-[#0464bc] text-xl mr-2 mt-1' />
    },
    {
      category: 'BMI',
      levels: [
        { label: 'Division Wise', value: 'bmi-division-wise' },
        { label: 'Subdistrict Wise (Chittagong District)', value: 'bmi-chittagong-district' },
        { label: 'Chittagong City Corporation', value: 'bmi-chittagong-city' },
      ],
      icon: <ScheduleIcon className='text-[#0464bc] text-xl mr-2 mt-1' />
    },
    {
      category: 'Height',
      levels: [
        { label: 'Division Wise', value: 'height-division-wise' },
        { label: 'Subdistrict Wise (Chittagong District)', value: 'height-chittagong-district' },
        { label: 'Chittagong City Corporation', value: 'height-chittagong-city' },
      ],
      icon: <ScheduleIcon className='text-[#0464bc] text-xl mr-2 mt-1' />
    },
    {
      category: 'Weight',
      levels: [
        { label: 'Division Wise', value: 'weight-division-wise' },
        { label: 'Subdistrict Wise (Chittagong District)', value: 'weight-chittagong-district' },
        { label: 'Chittagong City Corporation', value: 'weight-chittagong-city' },
      ],
      icon: <ScheduleIcon className='text-[#0464bc] text-xl mr-2 mt-1' />
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
          fontWeight: selectedValue === level.value ? '700 !important' : '500 !important',
          color: selectedValue === level.value ? 'white !important' : '#1d85c8 !important',
          border: '1px solid #0464bc',
          bgcolor: selectedValue === level.value ? '#1d85c8 !important' : 'white !important'
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
      {/* <Box className="h-[10vh] py-1 flex justify-between bg-[#1d85c8] items-center px-4">
        <img
          src="/Static/Logo/cdgh_logo.png"
          alt="Left Logo"
          className="h-full w-auto bg-slate-50 rounded"
        />
        <Typography
          variant="h4"
          className="text-[#0c2461] text-center"
          sx={{ fontFamily: 'monospace', flexGrow: 1, fontWeight:700 }}
        >
          Chattogram Diabetic General Hospital Dashboard
        </Typography>
        <img
          src="/Static/Logo/bike-lab-logo.png"
          alt="Right Logo"
          className="h-full w-auto bg-[#0c2461] rounded"
        />
      </Box> */}


      <Box className="w-full flex h-[100vh] justify-between">

        <Box className="flex bg-[#1d85c8] flex-col items-center flex-nowrap w-1/4 pt-4 pb-4 h-full overflow-y-auto">
          {/* <Typography variant="h4" gutterBottom>
            Visualize
          </Typography> */}
          {options.map((option) => (
            <CustomAccordion option={option} handleSelectionChange={handleSelectionChange} renderOptions={renderOptions} />
          ))}
        </Box>

        <Box className="px-1 h-[100vh] w-full overflow-y-auto">
          <Tabs className='pt-1' value={selectedTab} onChange={handleTabChange} aria-label="Main Tabs">
            {
              // ["Graphical", "Tabular", "Map"]
              ["Graphical", "Tabular"].map((tab, id) => {
                return <Tab sx={{
                  color: id === selectedTab ? '#0c2461 !important' : '',
                  fontWeight: id === selectedTab ? 'bold !important' : '500',
                  cursor: 'pointer',
                  transition: '0.3s ease',
                }}
                  key={id} label={tab} />
              })
            }
          </Tabs>
          <Box className="h-[90%] w-full border overflow-auto" sx={{ borderColor: '#0c1021' }}>
            {selectedTab === 0 && <GraphicalContent setTableRows={setTableRows} setTableCols={setTableCols} selectedValue={selectedValue} />}
            {selectedTab === 1 && <TabularContent tableRows={tableRows} tableCols={tableCols} />}
            {selectedTab === 2 && <MapContent selectedValue={selectedValue} />}
          </Box>
        </Box>
      </Box>
      {/* A copywrite text with Box  here  */}
      {/* <Box className="w-full h-[10vh] py-1 flex justify-center items-center bg-[#0c2461] px-4">
        Developed by BIKE Lab (https://web.bike-csecu.com)
        <Typography variant="subtitle1" className="text-[#fff] text-center">
          Developed by <a href='https://web.bike-csecu.com' className='font-bold'>BIKE Lab</a> | Copyright © 2025 All rights reserved.
        </Typography>
      </Box> */}
      



    </Box>
  )
}
