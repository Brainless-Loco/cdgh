import React, { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function MonthlyEntriesLineGraph({ setTableRows, setTableCols }) {
    // Static data
    const monthlyData = useMemo(() => [
        { month: '01-2024', total: 1882, male: 947, female: 935 },
        { month: '02-2024', total: 1001, male: 489, female: 512 },
        { month: '03-2024', total: 821, male: 374, female: 447 },
        { month: '04-2024', total: 1100, male: 536, female: 564 }, 
        { month: '05-2024', total: 955, male: 460, female: 495 },   
        { month: '06-2024', total: 910, male: 450, female: 460 },   
        { month: '07-2024', total: 1290, male: 730, female: 760 },  
        { month: '08-2024', total: 1200, male: 570, female: 630 },  
        { month: '09-2024', total: 900, male: 460, female: 540 },   
        { month: '10-2024', total: 1084, male: 460, female: 624 },
        { month: '11-2024', total: 1320, male: 630, female: 690 },  
        { month: '12-2024', total: 1000, male: 480, female: 520 },
    ], []);
    
    

    // Extract data for the chart
    const labels = useMemo(() => [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ], []);

    const totalData = useMemo(() => monthlyData.map(entry => entry.total), [monthlyData]);
    const maleData = useMemo(() => monthlyData.map(entry => entry.male), [monthlyData]);
    const femaleData = useMemo(() => monthlyData.map(entry => entry.female), [monthlyData]);

    // Set table data only once after component mounts
    useEffect(() => {
        setTableCols([
            { field: 'month', headerName: 'Month', flex: 1 },
            { field: 'total', headerName: 'Total Entries', flex: 1 },
            { field: 'male', headerName: 'Male', flex: 1 },
            { field: 'female', headerName: 'Female', flex: 1 },
        ]);

        setTableRows(monthlyData.map((entry, index) => ({
            id: index, // Unique ID for each row
            month: entry.month,
            total: entry.total,
            male: entry.male,
            female: entry.female,
        })));
    }, [setTableRows, setTableCols, monthlyData]);

    // Chart Data
    const data = useMemo(() => ({
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
    }), [labels, totalData, maleData, femaleData]);

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
