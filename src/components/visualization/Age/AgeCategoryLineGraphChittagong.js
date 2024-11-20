import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function AgeCategoryLineGraphChittagong() {
    const [ageCategoryData, setAgeCategoryData] = useState({});

    useEffect(() => {
        // Parse finalData.csv to categorize and count patients by age for each subdistrict
        Papa.parse('/finalData.csv', {
            download: true,
            header: true,
            complete: (result) => {
                const data = result.data.filter((row) => row.ADM2_EN === 'Chittagong');
                const subdistricts = data.reduce((acc, row) => {
                    const subdistrict = row.ADM3_EN; // Subdistrict column
                    const age = parseInt(row.Age, 10);

                    if (!subdistrict || isNaN(age)) return acc;

                    if (!acc[subdistrict]) {
                        acc[subdistrict] = {
                            Children: 0,
                            'Early Working Age': 0,
                            'Prime Working Age': 0,
                            'Mature Working Age': 0,
                            Elderly: 0,
                        };
                    }

                    if (age >= 0 && age <= 14) acc[subdistrict].Children += 1;
                    else if (age >= 15 && age <= 24) acc[subdistrict]['Early Working Age'] += 1;
                    else if (age >= 25 && age <= 54) acc[subdistrict]['Prime Working Age'] += 1;
                    else if (age >= 55 && age <= 64) acc[subdistrict]['Mature Working Age'] += 1;
                    else if (age >= 65) acc[subdistrict].Elderly += 1;

                    return acc;
                }, {});

                setAgeCategoryData(subdistricts);
            },
        });
    }, []);

    const labels = Object.keys(ageCategoryData); // Subdistrict names
    const data = {
        labels,
        datasets: [
            {
                label: 'Children (0-14)',
                data: labels.map((subdistrict) => ageCategoryData[subdistrict]?.Children || 0),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0, // Straight lines
                fill: false,
            },
            {
                label: 'Early Working Age (15-24)',
                data: labels.map((subdistrict) => ageCategoryData[subdistrict]?.['Early Working Age'] || 0),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0, // Straight lines
                fill: false,
            },
            {
                label: 'Prime Working Age (25-54)',
                data: labels.map((subdistrict) => ageCategoryData[subdistrict]?.['Prime Working Age'] || 0),
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                tension: 0, // Straight lines
                fill: false,
            },
            {
                label: 'Mature Working Age (55-64)',
                data: labels.map((subdistrict) => ageCategoryData[subdistrict]?.['Mature Working Age'] || 0),
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                tension: 0, // Straight lines
                fill: false,
            },
            {
                label: 'Elderly (65+)',
                data: labels.map((subdistrict) => ageCategoryData[subdistrict]?.Elderly || 0),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0, // Straight lines
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
                    text: 'Subdistricts (ADM3)',
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
        <Box className="h-[90%] w-full">
            <Typography variant="h5">Age Distribution by Subdistrict (Chittagong District)</Typography>
            <Line data={data} options={options} />
        </Box>
    );
}
