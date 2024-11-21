import React from 'react'
import LocationOverallInBangladesh from '../visualization/Location/LocationOverallInBangladesh'
import DivisionWiseBarGraph from '../visualization/Location/DivisionWiseBarGraph'
import DistrictBarGraph from '../visualization/Location/DistrictBarGraph'
import DivisionSexDistributionBarChart from '../visualization/Sex/DivisionSexDistributionBarChart'
import ADM3SexDistributionChittagong from '../visualization/Sex/ADM3SexDistributionChittagong'
import MonthlyEntriesLineGraph from '../visualization/Time/MonthlyEntriesLineGraph'
import WeekdayEntriesLineGraph from '../visualization/Time/WeekdayEntriesLineGraph'
import AgeCategoryDistributionPieChart from '../visualization/Age/AgeCategoryDistributionPieChart'
import AgeDistributionByDivisionPieCharts from '../visualization/Age/AgeDistributionByDivisionPieCharts'
import AgeCategoryLineGraphChittagong from '../visualization/Age/AgeCategoryLineGraphChittagong'
import SexCategoryOveraAllInBangladeshPieChart from '../visualization/Sex/OverallInBangladesh';
import Typography from '@mui/material/Typography';
import Box  from '@mui/material/Box'

export default function GraphicalContent({selectedValue, setTableRows, setTableCols}) {
  return (
    <Box className="w-[100%] h-full flex justify-center items-center">
        {
            selectedValue === '' && (
                <Typography variant="h5" className="text-center">
                    Please select a category first.
                </Typography>
            )
        }
        {selectedValue === 'location-overall-bangladesh' && <LocationOverallInBangladesh setTableRows={setTableRows} setTableCols={setTableCols}/>}
        {selectedValue === 'location-division' && <DivisionWiseBarGraph setTableRows={setTableRows} setTableCols={setTableCols}/>}
        {selectedValue === 'location-district' && <DistrictBarGraph setTableRows={setTableRows} setTableCols={setTableCols}/>}
        {selectedValue === 'sex-overall-bangladesh' && <SexCategoryOveraAllInBangladeshPieChart setTableRows={setTableRows} setTableCols={setTableCols}/>}
        {selectedValue === 'sex-division-wise' && <DivisionSexDistributionBarChart setTableRows={setTableRows} setTableCols={setTableCols}/>}
        {selectedValue === 'sex-chittagong-district' && <ADM3SexDistributionChittagong setTableRows={setTableRows} setTableCols={setTableCols}/>}
        {selectedValue === 'time-month' && <MonthlyEntriesLineGraph setTableRows={setTableRows} setTableCols={setTableCols}/>}
        {selectedValue === 'time-weekday' && <WeekdayEntriesLineGraph setTableRows={setTableRows} setTableCols={setTableCols}/>}
        {selectedValue === 'age-overall-bangladesh' && <AgeCategoryDistributionPieChart setTableRows={setTableRows} setTableCols={setTableCols}/>}
        {selectedValue === 'age-division-wise' && <AgeDistributionByDivisionPieCharts setTableRows={setTableRows} setTableCols={setTableCols}/>}
        {selectedValue === 'age-chittagong-district' && <AgeCategoryLineGraphChittagong setTableRows={setTableRows} setTableCols={setTableCols}/>}
    </Box>
  )
}
