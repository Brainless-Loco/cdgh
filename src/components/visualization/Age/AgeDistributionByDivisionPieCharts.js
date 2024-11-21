import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AgeDistributionByDivisionPieCharts() {
    const [divisionData, setDivisionData] = useState({});

    useEffect(() => {
        // Parse finalData.csv to categorize and count patients by age for each division
        Papa.parse('/finalData.csv', {
            download: true,
            header: true,
            complete: (result) => {
                const divisions = result.data.reduce((acc, row) => {
                    const division = row.ADM1_EN; // Division column
                    const age = parseInt(row.Age, 10);

                    if (!division || division === 'Unknown' || isNaN(age)) return acc;

                    if (!acc[division]) {
                        acc[division] = {
                            Children: 0,
                            'Early Working Age': 0,
                            'Prime Working Age': 0,
                            'Mature Working Age': 0,
                            Elderly: 0,
                        };
                    }

                    if (age >= 0 && age <= 14) acc[division].Children += 1;
                    else if (age >= 15 && age <= 24) acc[division]['Early Working Age'] += 1;
                    else if (age >= 25 && age <= 54) acc[division]['Prime Working Age'] += 1;
                    else if (age >= 55 && age <= 64) acc[division]['Mature Working Age'] += 1;
                    else if (age >= 65) acc[division].Elderly += 1;

                    return acc;
                }, {});

                setDivisionData(divisions);
            },
        });
    }, []);

    const colors = [
        'rgba(75, 192, 192, 0.7)',  // Children
        'rgba(54, 162, 235, 0.7)',  // Early Working Age
        'rgba(255, 206, 86, 0.7)',  // Prime Working Age
        'rgba(153, 102, 255, 0.7)', // Mature Working Age
        'rgba(255, 99, 132, 0.7)',  // Elderly
    ];

    const renderPieCharts = () => {
        return Object.keys(divisionData).map((division) => {
            const data = {
                labels: [
                    'Children (0-14)',
                    'Early Working Age (15-24)',
                    'Prime Working Age (25-54)',
                    'Mature Working Age (55-64)',
                    'Elderly (65+)',
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
