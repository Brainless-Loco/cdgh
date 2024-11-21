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

export default function GraphicalContent({selectedValue}) {
  return (
    <Box className="w-[100%] h-full flex justify-center items-center">
        {
            selectedValue === '' && (
                <Typography variant="h5" className="text-center">
                    Please select a category first.
                </Typography>
            )
        }
        {selectedValue === 'location-overall-bangladesh' && <LocationOverallInBangladesh />}
        {selectedValue === 'location-division' && <DivisionWiseBarGraph />}
        {selectedValue === 'location-district' && <DistrictBarGraph />}
        {selectedValue === 'sex-overall-bangladesh' && <SexCategoryOveraAllInBangladeshPieChart />}
        {selectedValue === 'sex-division-wise' && <DivisionSexDistributionBarChart />}
        {selectedValue === 'sex-chittagong-district' && <ADM3SexDistributionChittagong />}
        {selectedValue === 'time-month' && <MonthlyEntriesLineGraph />}
        {selectedValue === 'time-weekday' && <WeekdayEntriesLineGraph />}
        {selectedValue === 'age-overall-bangladesh' && <AgeCategoryDistributionPieChart />}
        {selectedValue === 'age-division-wise' && <AgeDistributionByDivisionPieCharts />}
        {selectedValue === 'age-chittagong-district' && <AgeCategoryLineGraphChittagong />}
    </Box>
  )
}
