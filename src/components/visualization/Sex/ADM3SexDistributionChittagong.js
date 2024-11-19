import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, BarElement, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, BarElement, Tooltip, Legend);

export default function ADM3SexDistributionChittagong() {
    const [adm3Data, setAdm3Data] = useState([]);
    const [sexCountsByADM3, setSexCountsByADM3] = useState({});

    useEffect(() => {
        // Parse finalData.csv to count occurrences of male and female for each ADM3_EN in Chittagong
        Papa.parse('/finalData.csv', {
            download: true,
            header: true,
            complete: (result) => {
                console.log("Parsed CSV data:", result.data); // Debugging

                const counts = result.data.reduce((acc, row) => {
                    const adm2 = row.ADM2_EN; // Assuming 'ADM2_EN' is the column for the district
                    const adm3 = row.ADM3_EN; // Assuming 'ADM3_EN' is the column for sub-district
                    const sex = row.Sex; // Assuming 'Sex' is the column for gender

                    // Filter rows where ADM2_EN is "Chittagong" and ignore invalid data
                    if (adm2 === "Chittagong" && adm3 && sex) {
                        if (!acc[adm3]) {
                            acc[adm3] = { Male: 0, Female: 0 };
                        }
                        if (sex === 'M') {
                            acc[adm3].Male += 1;
                        } else if (sex === 'F') {
                            acc[adm3].Female += 1;
                        }
                    }
                    return acc;
                }, {});

                console.log("Sex counts by subdistricts (Upazila) in Chittagong:", counts); // Debugging
                setSexCountsByADM3(counts);

                // Extract ADM3_EN names for x-axis
                const adm3Names = Object.keys(counts);
                setAdm3Data(adm3Names);
            },
        });
    }, []);

    const data = {
        labels: adm3Data, // ADM3_EN names on the x-axis
        datasets: [
            {
                label: 'Male',
                data: adm3Data.map(adm3 => sexCountsByADM3[adm3]?.Male || 0), // Male count for each ADM3_EN
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: 'Female',
                data: adm3Data.map(adm3 => sexCountsByADM3[adm3]?.Female || 0), // Female count for each ADM3_EN
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const value = tooltipItem.raw;
                        return `${tooltipItem.dataset.label}: ${value}`;
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
                    text: 'Sub-districts',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Count',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <Box className="h-[90%] w-full">
            <Typography variant='h5'>Sex Distribution of patients by subdistricts in Chittagong</Typography>
            <Bar data={data} options={options} />
        </Box>
    );
}
