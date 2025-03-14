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
      icon: <LocationOnIcon className='text-white text-xl mr-2 mt-1'/>
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
      icon: <WcIcon  className='text-white text-xl mr-2 mt-1'/>
    },
    {
      category: 'Time',
      levels: [
        { label: 'Month', value: 'time-month' }, // Line Graph
        { label: 'WeekDay', value: 'time-weekday' }, // Bargraph
      ],
      icon: <CalendarTodayIcon className='text-white text-xl mr-2 mt-1'/>
    },
    {
      category: 'Age',
      levels: [
        { label: 'Overall in Bangladesh', value: 'age-overall-bangladesh' },
        { label: 'Division Wise', value: 'age-division-wise' },
        { label: 'Subdistrict Wise (Chittagong District)', value: 'age-chittagong-district' },
        { label: 'Chittagong City Corporation', value: 'age-chittagong-city' },
      ],
      icon: <ScheduleIcon className='text-white text-xl mr-2 mt-1'/>
    },
    {
      category: 'Physical Metrics',
      levels: [
        { label: 'BMI Distribution', value: 'physical-bmi-distribution' },
        { label: 'Height Range', value: 'physical-height-range' },
        { label: 'Weight Range', value: 'physical-weight-range' },
      ],
      icon: <MonitorHeartIcon className='text-white text-xl mr-2 mt-1'/>
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
          fontWeight: selectedValue === level.value ? '500 !important':'400 !important',
          color:  selectedValue === level.value ? '#0a1b4a !important':'white !important',
          border:'1px solid white',
          bgcolor:selectedValue === level.value && 'white !important'
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

        <Box className="flex bg-slate-300 flex-col items-center flex-nowrap w-1/4 pt-4 pb-4 h-[90vh] overflow-y-auto">
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
                  border:id === selectedTab ? "2px solid #111a40" : '2px solid transparent',
                  borderWidth:'3px',
                  // borderTop:'none',
                  color:id === selectedTab ? '#0c2461 !important':'',
                  fontWeight: id === selectedTab? 'bold !important' : '500',
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

    </Box>
  )
}
