import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DistrictBarGraph({setTableRows, setTableCols}) {
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
    
                // Set district counts
                setDistrictCounts(counts);
                setDistrictNames(Object.keys(counts));
    
                // Dynamically generate rows and columns for DataGrid
                setTableRows(
                    Object.entries(counts).map(([district, count], index) => ({
                        id: index + 1, // Unique ID for each row
                        district,
                        count,
                    }))
                );
    
                setTableCols([
                    { field: 'id', headerName: 'ID', flex: 0.5 },
                    { field: 'district', headerName: 'District', flex: 1 },
                    { field: 'count', headerName: 'Count', flex: 1 },
                ]);
            },
        });
    }, [setTableRows, setTableCols]);
    

    const data = {
        labels: districtNames,
        datasets: [
            {
                label: 'Number of Patients per District',
                data: districtNames.map((district) => districtCounts[district] || 0),
                backgroundColor: '#ff0000',
                borderColor: '#ff0000',
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
