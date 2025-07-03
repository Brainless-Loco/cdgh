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

export default function WeightBarGraph({ setTableRows, setTableCols }) {
    const [weightCounts, setWeightCounts] = useState({
        '<50 kg': { M: 0, F: 0 },
        '50-59 kg': { M: 0, F: 0 },
        '60-69 kg': { M: 0, F: 0 },
        '70-79 kg': { M: 0, F: 0 },
        '80+ kg': { M: 0, F: 0 },
    });

    useEffect(() => {
        Papa.parse('/finalData_01.csv', {
            download: true,
            header: true,
            complete: (result) => {
                const counts = result.data.reduce((acc, row) => {
                    const weightKg = parseFloat(row['WEIGHT (KG)']);
                    const sex = row['Sex'];
                    if (!isNaN(weightKg)) {
                        if (weightKg < 50) acc['<50 kg'][sex] += 1;
                        else if (weightKg >= 50 && weightKg < 60) acc['50-59 kg'][sex] += 1;
                        else if (weightKg >= 60 && weightKg < 70) acc['60-69 kg'][sex] += 1;
                        else if (weightKg >= 70 && weightKg < 80) acc['70-79 kg'][sex] += 1;
                        else acc['80+ kg'][sex] += 1;
                    }
                    return acc;
                }, {
                    '<50 kg': { M: 0, F: 0 },
                    '50-59 kg': { M: 0, F: 0 },
                    '60-69 kg': { M: 0, F: 0 },
                    '70-79 kg': { M: 0, F: 0 },
                    '80+ kg': { M: 0, F: 0 },
                });

                setWeightCounts(counts);

                // Prepare data for table rows and columns
                const tableRows = [];
                let rowId = 0;
                Object.keys(counts).forEach((range) => {
                    tableRows.push({
                        id: rowId++, // Unique ID for each row
                        category: 'Weight',
                        range: range,
                        maleCount: counts[range].M,
                        femaleCount: counts[range].F,
                    });
                });

                const tableCols = [
                    { field: 'category', headerName: 'Category', flex: 1 },
                    { field: 'range', headerName: 'Weight Range (in Kg)', flex: 1 },
                    { field: 'maleCount', headerName: 'Male Count', flex: 1 },
                    { field: 'femaleCount', headerName: 'Female Count', flex: 1 },
                ];

                setTableRows(tableRows);
                setTableCols(tableCols);
            },
        });
    }, [setTableRows, setTableCols]);

    const labels = Object.keys(weightCounts);
    const data = {
        labels,
        datasets: [
            {
                label: 'Male',
                data: labels.map(range => weightCounts[range].M),
                backgroundColor: 'red',
                barThickness: 30,
                borderRadius: 4,
                borderSkipped: false,
            },
            {
                label: 'Female',
                data: labels.map(range => weightCounts[range].F),
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
                    text: 'Weight Range (in Kg)',
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
            <Typography variant='h5'>Weight Distribution (Male vs Female)</Typography>
            <Box className="h-[90%] w-full flex justify-center items-center">
                <Bar data={data} options={options} />
            </Box>
        </Box>
    );
}
