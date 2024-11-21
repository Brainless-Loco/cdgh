import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function MonthlyEntriesLineGraph({setTableRows, setTableCols}) {
    const [monthlyCounts, setMonthlyCounts] = useState({});

    useEffect(() => {
        // Parse finalData.csv to count entries for each month and by gender
        Papa.parse('/finalData.csv', {
            download: true,
            header: true,
            complete: (result) => {
                const counts = result.data.reduce((acc, row) => {
                    const entryDate = row['Entry Date']; // Assuming 'Entry Date' is the column name
                    const sex = row['Sex']; // Assuming 'Sex' is the column name
                    if (entryDate && sex) {
                        const [day, month, year] = entryDate.split('/').map(Number);
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

    const labels = Object.keys(monthlyCounts).map((key) => {
        const [month, year] = key.split('-');
        return `${monthNames[parseInt(month, 10) - 1]}`; // Convert month to name
    });

    const totalData = Object.values(monthlyCounts).map((data) => data.total);
    const maleData = Object.values(monthlyCounts).map((data) => data.male);
    const femaleData = Object.values(monthlyCounts).map((data) => data.female);

    const data = {
        labels,
        datasets: [
            {
                label: 'Total',
                data: totalData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(4, 192, 192, 0.2)',
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
