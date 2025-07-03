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
import ADM3TotalCountsChittagong from '../visualization/Location/ADM3TotalCountsChittagong'
import BMIBarGraph from '../visualization/Physical_Matrics/BMIBarGraph'
import HeightBarGraph from '../visualization/Physical_Matrics/HeightBarGraph'
import WeightBarGraph from '../visualization/Physical_Matrics/WeightBarGraph'
import WardTotalCountsChittagong from '../visualization/Location/WardTotalCountsChittagong';
import AgeDistributionChittagongCityCorp from '../visualization/Age/ChittagongCityCorpAgeDistribution '
import WardSexDistributionChittagong from '../visualization/Sex/WardSexDistributionChittagong'
import BMICategoryByDivisionPieCharts from '../visualization/BMI/BMICategoryByDivisionPieCharts'
import HeightCategoryLineGraphChittagong from '../visualization/Height/HeightCategoryLineGraphChittagong'
import BMICategoryLineGraphChittagong from '../visualization/BMI/BMICategoryLineGraphChittagong'
import HeightCategoryByDivisionPieCharts from '../visualization/Height/HeightCategoryByDivisionPieCharts'
import WeightCategoryByDivisionPieCharts from '../visualization/Weight/WeightCategoryByDivisionPieCharts'
import WeightCategoryLineGraphChittagong from '../visualization/Weight/WeightCategoryLineGraphChittagong'


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
        {/* Location */}
        {selectedValue === 'location-overall-bangladesh' && <LocationOverallInBangladesh setTableRows={setTableRows} setTableCols={setTableCols}/>}
        {selectedValue === 'location-division' && <DivisionWiseBarGraph setTableRows={setTableRows} setTableCols={setTableCols}/>}
        {selectedValue === 'location-district' && <DistrictBarGraph setTableRows={setTableRows} setTableCols={setTableCols}/>}
        {selectedValue === 'location-chittagong-district' && <ADM3TotalCountsChittagong  setTableRows={setTableRows} setTableCols={setTableCols}/> }
        {selectedValue === 'location-chittagong-city' && <WardTotalCountsChittagong setTableRows={setTableRows} setTableCols={setTableCols}/>}

        {/* Sex */}
        {selectedValue === 'sex-overall-bangladesh' && <SexCategoryOveraAllInBangladeshPieChart setTableRows={setTableRows} setTableCols={setTableCols}/>}
        {selectedValue === 'sex-division-wise' && <DivisionSexDistributionBarChart setTableRows={setTableRows} setTableCols={setTableCols}/>}
        {selectedValue === 'sex-chittagong-district' && <ADM3SexDistributionChittagong setTableRows={setTableRows} setTableCols={setTableCols}/>}
        {selectedValue === 'sex-chittagong-city' && <WardSexDistributionChittagong setTableRows={setTableRows} setTableCols={setTableCols}/>}

        {/* Tme */}
        {selectedValue === 'time-month' && <MonthlyEntriesLineGraph setTableRows={setTableRows} setTableCols={setTableCols}/>}
        {selectedValue === 'time-weekday' && <WeekdayEntriesLineGraph setTableRows={setTableRows} setTableCols={setTableCols}/>}

        {/* Age */}
        {selectedValue === 'age-overall-bangladesh' && <AgeCategoryDistributionPieChart setTableRows={setTableRows} setTableCols={setTableCols}/>}
        {selectedValue === 'age-division-wise' && <AgeDistributionByDivisionPieCharts setTableRows={setTableRows} setTableCols={setTableCols}/>}
        {selectedValue === 'age-chittagong-district' && <AgeCategoryLineGraphChittagong setTableRows={setTableRows} setTableCols={setTableCols}/>}
        {selectedValue === 'age-chittagong-city' && <AgeDistributionChittagongCityCorp setTableRows={setTableRows} setTableCols={setTableCols}/>}

        {/* BMI */}
        {selectedValue === 'bmi-division-wise' && <BMICategoryByDivisionPieCharts setTableRows={setTableRows} setTableCols={setTableCols}/>}
        {selectedValue === 'bmi-chittagong-district' && <BMICategoryLineGraphChittagong setTableRows={setTableRows} setTableCols={setTableCols}/>}

        {/* Height */}
        {selectedValue === 'height-division-wise' && <HeightCategoryByDivisionPieCharts setTableRows={setTableRows} setTableCols={setTableCols}/>}
        {selectedValue === 'height-chittagong-district' && <HeightCategoryLineGraphChittagong setTableRows={setTableRows} setTableCols={setTableCols}/>}

        {/* Weight */}
        {selectedValue === 'weight-division-wise' && <WeightCategoryByDivisionPieCharts setTableRows={setTableRows} setTableCols={setTableCols}/>}
        {selectedValue === 'weight-chittagong-district' && <WeightCategoryLineGraphChittagong setTableRows={setTableRows} setTableCols={setTableCols}/>}



        {/* Physical Metrics */}
        {selectedValue === 'physical-bmi-distribution' && <BMIBarGraph setTableRows={setTableRows} setTableCols={setTableCols}/> }
        {selectedValue === 'physical-height-range' && <HeightBarGraph setTableRows={setTableRows} setTableCols={setTableCols}/> }
        {selectedValue === 'physical-weight-range' && <WeightBarGraph setTableRows={setTableRows} setTableCols={setTableCols}/> }
    </Box>
  )
}
