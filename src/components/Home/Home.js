import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOverallInBangladesh from '../visualization/Location/LocationOverallInBangladesh';
import DivisionWiseBarGraph from '../visualization/Location/DivisionWiseBarGraph';
import DistrictBarGraph from '../visualization/Location/DistrictBarGraph';
import SexCategoryOveraAllInBangladeshPieChart from '../visualization/Sex/OverallInBangladesh';
import DivisionSexDistributionBarChart from '../visualization/Sex/DivisionSexDistributionBarChart';
import ADM3SexDistributionChittagong from '../visualization/Sex/ADM3SexDistributionChittagong';
import MonthlyEntriesLineGraph from '../visualization/Time/MonthlyEntriesLineGraph';
import WeekdayEntriesLineGraph from '../visualization/Time/WeekdayEntriesLineGraph';
import AgeCategoryDistributionPieChart from '../visualization/Age/AgeCategoryDistributionPieChart';
import AgeDistributionByDivisionPieCharts from '../visualization/Age/AgeDistributionByDivisionPieCharts';
export default function Home() {

  const [selectedValue, setSelectedValue] = useState('');

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
  ]);

  // Handle selection
  const handleSelectionChange = (value) => {
    setSelectedValue(value)
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
        <Typography variant='h4' className='text-cyan-700'>Chattogram Diabetic General Hospital Dashboard</Typography>
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
        
        <Box className="border-l-cyan-700 pl-2 border-l h-[90vh] w-3/4  overflow-y-auto flex justify-center items-center">
            {
              selectedValue === '' && <Typography variant="h5" className='text-center'>Please select a category first.</Typography>
            }
            {
              selectedValue === 'location-overall-bangladesh' && <LocationOverallInBangladesh/>
            }
            {
              selectedValue === 'location-division' && <DivisionWiseBarGraph/>
            }
            {
              selectedValue === 'location-district' && <DistrictBarGraph/>
            }
            {
              selectedValue === 'sex-overall-bangladesh' && <SexCategoryOveraAllInBangladeshPieChart/>
            }
            {
              selectedValue === 'sex-division-wise' && <DivisionSexDistributionBarChart/>
            }
            {
              selectedValue === 'sex-chittagong-district' && <ADM3SexDistributionChittagong/>
            }
            {
              selectedValue === 'time-month' && <MonthlyEntriesLineGraph/>
            }
            {
              selectedValue === 'time-weekday' && <WeekdayEntriesLineGraph/>
            }
            {
              selectedValue === 'age-overall-bangladesh' && <AgeCategoryDistributionPieChart/>
            }
            {
              selectedValue === 'age-division-wise' && <AgeDistributionByDivisionPieCharts/>
            }
        </Box>
      </Box>
        
    </Box>
  )
}
