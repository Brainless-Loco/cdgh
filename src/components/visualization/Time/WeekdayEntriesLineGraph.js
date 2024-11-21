import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function WeekdayEntriesLineGraph({setTableRows, setTableCols}) {
    const [weekdayCounts, setWeekdayCounts] = useState({
        Sunday: { Total: 0, Male: 0, Female: 0 },
        Monday: { Total: 0, Male: 0, Female: 0 },
        Tuesday: { Total: 0, Male: 0, Female: 0 },
        Wednesday: { Total: 0, Male: 0, Female: 0 },
        Thursday: { Total: 0, Male: 0, Female: 0 },
        Friday: { Total: 0, Male: 0, Female: 0 },
        Saturday: { Total: 0, Male: 0, Female: 0 },
    });

    useEffect(() => {
        Papa.parse('/finalData.csv', {
            download: true,
            header: true,
            complete: (result) => {
                const counts = result.data.reduce((acc, row) => {
                    const entryDate = row['Entry Date'];
                    const sex = row['Sex'];
    
                    // Ensure valid 'Entry Date' and 'Sex' values
                    if (entryDate && (sex === 'M' || sex === 'F')) {
                        const [day, month, year] = entryDate.split('/').map(Number);
                        const dateObj = new Date(year, month - 1, day);
                        const weekday = dateObj.toLocaleString('en-US', { weekday: 'long' });
    
                        // Initialize the weekday object if not already present
                        if (!acc[weekday]) {
                            acc[weekday] = { Total: 0, Male: 0, Female: 0 };
                        }
    
                        acc[weekday].Total += 1;
                        if (sex === 'M') acc[weekday].Male += 1;
                        if (sex === 'F') acc[weekday].Female += 1;
                    }
    
                    return acc;
                }, {
                    Sunday: { Total: 0, Male: 0, Female: 0 },
                    Monday: { Total: 0, Male: 0, Female: 0 },
                    Tuesday: { Total: 0, Male: 0, Female: 0 },
                    Wednesday: { Total: 0, Male: 0, Female: 0 },
                    Thursday: { Total: 0, Male: 0, Female: 0 },
                    Friday: { Total: 0, Male: 0, Female: 0 },
                    Saturday: { Total: 0, Male: 0, Female: 0 },
                });
    
                // Set the counts to state for weekday counts
                setWeekdayCounts(counts);
    
                // Prepare data for table rows and columns
                const tableRows = [];
                let rowId = 0; // Initialize a row counter to generate unique IDs
    
                Object.keys(counts).forEach((weekday) => {
                    // For each weekday, create unique rows for total, male, and female counts
                    tableRows.push({
                        id: rowId++, // Unique ID for each row
                        weekday: weekday,
                        type: 'Total',
                        count: counts[weekday].Total,
                    });
                    tableRows.push({
                        id: rowId++, // Unique ID for each row
                        weekday: weekday,
                        type: 'Male',
                        count: counts[weekday].Male,
                    });
                    tableRows.push({
                        id: rowId++, // Unique ID for each row
                        weekday: weekday,
                        type: 'Female',
                        count: counts[weekday].Female,
                    });
                });
    
                const tableCols = [
                    { field: 'weekday', headerName: 'Weekday',  flex:1 },
                    { field: 'type', headerName: 'Type',  flex:1 },
                    { field: 'count', headerName: 'Count',  flex:1 },
                ];
    
                // Update table rows and columns state
                setTableRows(tableRows);
                setTableCols(tableCols);
            },
        });
    }, [setTableRows, setTableCols]);
    

    const labels = Object.keys(weekdayCounts); // Weekdays starting from Sunday
    const totalData = labels.map(day => weekdayCounts[day].Total);
    const maleData = labels.map(day => weekdayCounts[day].Male);
    const femaleData = labels.map(day => weekdayCounts[day].Female);

    const data = {
        labels,
        datasets: [
            {
                label: 'Total',
                data: totalData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
                fill: true,
            },
            {
                label: 'Male',
                data: maleData,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.1,
                fill: false,
            },
            {
                label: 'Female',
                data: femaleData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.1,
                fill: false,
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
                    text: 'Day of the Week',
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
            <Typography variant='h5'>Number of Patients by Weekday</Typography>
            <Box className="h-[90%] w-full flex justify-center items-center">
                <Line data={data} options={options} />
            </Box>
        </Box>
    );
}
