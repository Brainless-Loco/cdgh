import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AgeDistributionByDivisionPieCharts({setTableRows, setTableCols}) {
    const [divisionData, setDivisionData] = useState({});

    useEffect(() => {
        // Parse finalData.csv to categorize and count patients by age for each division
        Papa.parse('/finalData_01.csv', {
            download: true,
            header: true,
            complete: (result) => {
                const divisions = result.data.reduce((acc, row) => {
                    const division = row.ADM1_EN; // Division column
                    const age = parseInt(row.Age, 10);
    
                    if (!division || division === 'Unknown' || isNaN(age)) return acc;
    
                    if (!acc[division]) {
                        acc[division] = {
                            'Non-Adults': 0,
                            'Adults': 0,
                            'Mature Working Aged': 0,
                            Elderly: 0,
                        };
                    }
    
                    if (age >= 0 && age < 18) acc[division]["Non-Adults"] += 1;
                    else if (age >= 18 && age <= 40) acc[division]['Adults'] += 1;
                    else if (age >= 41 && age <= 60) acc[division]['Mature Working Aged'] += 1;
                    else if (age >= 61) acc[division].Elderly += 1;
    
                    return acc;
                }, {});
    
                // Set division counts to state
                setDivisionData(divisions);
    
                // Prepare table data for each division and age group
                const tableRows = [];
                let rowId = 0; // Initialize row counter for unique IDs
    
                Object.keys(divisions).forEach((division) => {
                    const divisionData = divisions[division];
                    Object.keys(divisionData).forEach((ageGroup) => {
                        tableRows.push({
                            id: rowId++, // Unique ID for each row
                            division: division,
                            ageGroup: ageGroup,
                            count: divisionData[ageGroup],
                        });
                    });
                });
    
                // Define table columns
                const tableCols = [
                    { field: 'division', headerName: 'Division', flex:1},
                    { field: 'ageGroup', headerName: 'Age Group', flex:1},
                    { field: 'count', headerName: 'Count', flex:1},
                ];
    
                // Set the table rows and columns to state
                setTableRows(tableRows);
                setTableCols(tableCols);
            },
        });
    }, [setTableRows, setTableCols]);
    

    const colors = [
        'purple',  // Non-Adults
        'red',  // Adults
        'blue', // Mature Working Age
        'yellow',  // Elderly
    ];

    const renderPieCharts = () => {
        return Object.keys(divisionData).map((division) => {
            const data = {
                labels: [
                    'Non-Adults (0-18)',
                    'Adults (18-40)',
                    'Mature Working Aged (41-60)',
                    'Elderly (60+)',
                ],
                datasets: [
                    {
                        data: Object.values(divisionData[division]),
                        backgroundColor: colors,
                        borderColor: ['#fff', '#fff', '#fff', '#fff', '#fff'],
                        borderWidth: 1,
                    },
                ],
            };

            const options = {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem) => {
                                const count = tooltipItem.raw;
                                const total = Object.values(divisionData[division]).reduce((sum, c) => sum + c, 0);
                                const percentage = ((count / total) * 100).toFixed(2);
                                return `${tooltipItem.label}: ${count} (${percentage}%)`;
                            },
                        },
                    },
                    legend: {
                        position: 'top',
                    },
                },
            };

            return (
                <Box key={division} className="w-[45%] m-1 mb-8 h-[65vh]">
                    <Typography variant="h6" textAlign="center">
                        {division}
                    </Typography>
                    <Box className="h-[90%] w-full flex justify-center items-center">
                        <Pie data={data} options={options} />
                    </Box>
                </Box>
            );
        });
    };

    return (
        <Box className='w-full overflow-auto h-full py-1'>
            <Box className="w-full flex justify-center flex-row flex-wrap">

                {renderPieCharts()}
            </Box>
        </Box>
    );
}
