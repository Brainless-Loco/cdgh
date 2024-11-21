import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DistrictBarGraph() {
    const [districtCounts, setDistrictCounts] = useState({});
    const [districtNames, setDistrictNames] = useState([]);
    
    useEffect(() => {
        // Parse finalData.csv to count rows per district
        Papa.parse('/finalData.csv', {
            download: true,
            header: true,
            complete: (result) => {
                const counts = result.data.reduce((acc, row) => {
                    const district = row.ADM2_EN; // District field
                    if (district && district !== 'Unknown') {
                        acc[district] = (acc[district] || 0) + 1;
                    }
                    return acc;
                }, {});
                setDistrictCounts(counts);
                setDistrictNames(Object.keys(counts));
            },
        });
    }, []);

    const data = {
        labels: districtNames,
        datasets: [
            {
                label: 'Number of Patients per District',
                data: districtNames.map((district) => districtCounts[district] || 0),
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'District-wise Data Distribution',
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `${tooltipItem.raw}`,
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 90, // Rotate labels to fit the screen
                    minRotation: 45,
                },
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <Box className='w-full h-full'>
            <Bar data={data} options={options} />
        </Box>
    );
}
