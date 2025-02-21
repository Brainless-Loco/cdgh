import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function HeightBarGraph({ setTableRows, setTableCols }) {
    const [heightCounts, setHeightCounts] = useState({
        '<5 ft': { M: 0, F: 0 },
        '5-5.3 ft': { M: 0, F: 0 },
        '5.4-5.6 ft': { M: 0, F: 0 },
        '5.7-5.9 ft': { M: 0, F: 0 },
        '6+ ft': { M: 0, F: 0 },
    });

    useEffect(() => {
        Papa.parse('/finalData.csv', {
            download: true,
            header: true,
            complete: (result) => {
                const counts = result.data.reduce((acc, row) => {
                    const heightCm = parseFloat(row['HEIGHT(CM)']);
                    const sex = row['Sex'];
                    if (!isNaN(heightCm)) {
                        const heightFeet = heightCm / 30.48; // Convert CM to Feet

                        if (heightFeet < 5) acc['<5 ft'][sex] += 1;
                        else if (heightFeet >= 5 && heightFeet < 5.4) acc['5-5.3 ft'][sex] += 1;
                        else if (heightFeet >= 5.4 && heightFeet < 5.7) acc['5.4-5.6 ft'][sex] += 1;
                        else if (heightFeet >= 5.7 && heightFeet < 6) acc['5.7-5.9 ft'][sex] += 1;
                        else acc['6+ ft'][sex] += 1;
                    }
                    return acc;
                }, {
                    '<5 ft': { M: 0, F: 0 },
                    '5-5.3 ft': { M: 0, F: 0 },
                    '5.4-5.6 ft': { M: 0, F: 0 },
                    '5.7-5.9 ft': { M: 0, F: 0 },
                    '6+ ft': { M: 0, F: 0 },
                });

                setHeightCounts(counts);

                // Prepare data for table rows and columns
                const tableRows = [];
                let rowId = 0;
                Object.keys(counts).forEach((range) => {
                    tableRows.push({
                        id: rowId++, // Unique ID for each row
                        category: 'Height',
                        range: range,
                        maleCount: counts[range].M,
                        femaleCount: counts[range].F,
                    });
                });

                const tableCols = [
                    { field: 'category', headerName: 'Category', flex: 1 },
                    { field: 'range', headerName: 'Height Range (in Feet)', flex: 1 },
                    { field: 'maleCount', headerName: 'Male Count', flex: 1 },
                    { field: 'femaleCount', headerName: 'Female Count', flex: 1 },
                ];

                setTableRows(tableRows);
                setTableCols(tableCols);
            },
        });
    }, [setTableRows, setTableCols]);

    const labels = Object.keys(heightCounts);
    const data = {
        labels,
        datasets: [
            {
                label: 'Male',
                data: labels.map(range => heightCounts[range].M),
                backgroundColor: 'red',
                barThickness: 30,
                borderRadius: 4,
                borderSkipped: false,
            },
            {
                label: 'Female',
                data: labels.map(range => heightCounts[range].F),
                backgroundColor: 'blue',
                barThickness: 30,
                borderRadius: 4,
                borderSkipped: false,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw}`,
                },
            },
            legend: {
                position: 'top',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Height Range (in Feet)',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Number of Patients',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <Box className="h-full w-full">
            <Typography variant='h5'>Height Distribution (Male vs Female)</Typography>
            <Box className="h-[90%] w-full flex justify-center items-center">
                <Bar data={data} options={options} />
            </Box>
        </Box>
    );
}
