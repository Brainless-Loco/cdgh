import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function MonthlyEntriesLineGraph({ setTableRows, setTableCols }) {
    const [monthlyCounts, setMonthlyCounts] = useState({});

    useEffect(() => {
        // Parse finalData.csv to count entries for each month and by gender
        Papa.parse('/finalData_01.csv', {
            download: true,
            header: true,
            complete: (result) => {
                const counts = result.data.reduce((acc, row) => {
                    const entryDate = row['Entry Date']; // Assuming 'Entry Date' is the column name
                    const sex = row['Sex']; // Assuming 'Sex' is the column name
                    if (entryDate && sex) {
                        // eslint-disable-next-line
                        const [month,day, year] = entryDate.split('/').map(Number);
                        const formattedMonth = `${String(month).padStart(2, '0')}-${year}`;
                        acc[formattedMonth] = acc[formattedMonth] || { total: 0, male: 0, female: 0 };
                        acc[formattedMonth].total += 1;
                        if (sex === 'M') acc[formattedMonth].male += 1;
                        if (sex === 'F') acc[formattedMonth].female += 1;
                    }
                    return acc;
                }, {});

                // Sort by year and month
                const sortedCounts = Object.keys(counts)
                    .sort((a, b) => {
                        const [monthA, yearA] = a.split('-').map(Number);
                        const [monthB, yearB] = b.split('-').map(Number);
                        return yearA === yearB ? monthA - monthB : yearA - yearB;
                    })
                    .reduce((acc, key) => {
                        acc[key] = counts[key];
                        return acc;
                    }, {});

                // Set the table columns (headers)
                const tableCols = [
                    { field: 'month', headerName: 'Month', flex: 1 },
                    { field: 'total', headerName: 'Total Entries', flex: 1 },
                    { field: 'male', headerName: 'Male', flex: 1 },
                    { field: 'female', headerName: 'Female', flex: 1 },
                ];
                setTableCols(tableCols);

                // Set the table rows
                const tableRows = Object.keys(sortedCounts).map((month) => ({
                    id: month, // Use month as the ID
                    month: month, // Format as "MM-YYYY"
                    total: sortedCounts[month].total,
                    male: sortedCounts[month].male,
                    female: sortedCounts[month].female,
                }));
                setTableRows(tableRows);

                // Optionally set monthlyCounts if needed for other purposes
                setMonthlyCounts(sortedCounts);
            },
        });
    }, [setTableRows, setTableCols]);

    // Map month numbers to their names
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Generate labels for all 12 months
    const labels = monthNames;

    // Initialize data for each month
    const totalData = new Array(12).fill(0);
    const maleData = new Array(12).fill(0);
    const femaleData = new Array(12).fill(0);

    // Populate the data arrays
    Object.keys(monthlyCounts).forEach((key) => {
        const [month] = key.split('-').map(Number);
        const monthIndex = month - 1; // Convert to zero-based index
        totalData[monthIndex] = monthlyCounts[key].total;
        maleData[monthIndex] = monthlyCounts[key].male;
        femaleData[monthIndex] = monthlyCounts[key].female;
    });

    const data = {
        labels,
        datasets: [
            {
                label: 'Total',
                data: totalData,
                borderColor: 'green',
                backgroundColor: 'green',
                tension: 0.1,
                fill: true,
            },
            {
                label: 'Male',
                data: maleData,
                borderColor: 'red',
                backgroundColor: 'red',
                tension: 0.1,
                fill: false,
            },
            {
                label: 'Female',
                data: femaleData,
                borderColor: 'blue',
                backgroundColor: 'blue',
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
                    label: (tooltipItem) => {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                    },
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
                    text: 'Month',
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
        <Box className="h-[90%] w-[95%]">
            <Typography variant='h5'>Monthly Patients with Gender Breakdown</Typography>
            <Line data={data} options={options} />
        </Box>
    );
}