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

export default function BMIBarGraph({ setTableRows, setTableCols }) {
    const [bmiCounts, setBmiCounts] = useState({
        'Underweight (BMI < 18.5)': { M: 0, F: 0 },
        'Normal weight (BMI 18.5 - 24.9)': { M: 0, F: 0 },
        'Overweight (BMI 25 - 29.9)': { M: 0, F: 0 },
        'Obesity (BMI ≥ 30)': { M: 0, F: 0 },
    });

    useEffect(() => {
        Papa.parse('/finalData_01.csv', {
            download: true,
            header: true,
            complete: (result) => {
                const counts = result.data.reduce((acc, row) => {
                    const bmi = parseFloat(row['BMI']);
                    const sex = row['Sex'];
                    if (!isNaN(bmi)) {
                        if (bmi < 18.5) acc['Underweight (BMI < 18.5)'][sex] += 1;
                        else if (bmi >= 18.5 && bmi <= 24.9) acc['Normal weight (BMI 18.5 - 24.9)'][sex] += 1;
                        else if (bmi >= 25 && bmi <= 29.9) acc['Overweight (BMI 25 - 29.9)'][sex] += 1;
                        else acc['Obesity (BMI ≥ 30)'][sex] += 1;
                    }
                    return acc;
                }, {
                    'Underweight (BMI < 18.5)': { M: 0, F: 0 },
                    'Normal weight (BMI 18.5 - 24.9)': { M: 0, F: 0 },
                    'Overweight (BMI 25 - 29.9)': { M: 0, F: 0 },
                    'Obesity (BMI ≥ 30)': { M: 0, F: 0 },
                });

                setBmiCounts(counts);

                // Prepare data for table rows and columns
                const tableRows = [];
                let rowId = 0;
                Object.keys(counts).forEach((category) => {
                    tableRows.push({
                        id: rowId++, // Unique ID for each row
                        category: 'BMI',
                        range: category,
                        maleCount: counts[category].M,
                        femaleCount: counts[category].F,
                    });
                });

                const tableCols = [
                    { field: 'category', headerName: 'Category', flex: 1 },
                    { field: 'range', headerName: 'BMI Category', flex: 1 },
                    { field: 'maleCount', headerName: 'Male Count', flex: 1 },
                    { field: 'femaleCount', headerName: 'Female Count', flex: 1 },
                ];

                setTableRows(tableRows);
                setTableCols(tableCols);
            },
        });
    }, [setTableRows, setTableCols]);

    const labels = Object.keys(bmiCounts);
    const data = {
        labels,
        datasets: [
            {
                label: 'Male',
                data: labels.map(category => bmiCounts[category].M),
                backgroundColor: 'red',
                barThickness: 30,
                borderRadius: 4,
                borderSkipped: false,
            },
            {
                label: 'Female',
                data: labels.map(category => bmiCounts[category].F),
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
                    text: 'BMI Category and Range',
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
            <Typography variant='h5'>BMI Distribution (Male vs Female)</Typography>
            <Box className="h-[90%] w-full flex justify-center items-center">
                <Bar data={data} options={options} />
            </Box>
        </Box>
    );
}
