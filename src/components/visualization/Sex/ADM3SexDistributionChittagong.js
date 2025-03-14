import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, BarElement, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, BarElement, Tooltip, Legend);

export default function ADM3SexDistributionChittagong({ setTableRows, setTableCols }) {
    const [adm3Data, setAdm3Data] = useState([]);
    const [sexCountsByADM3, setSexCountsByADM3] = useState({});

    useEffect(() => {
        // Parse finalData.csv to count occurrences of male and female for each ADM3_EN in Chittagong
        Papa.parse('/finalData_01.csv', {
            download: true,
            header: true,
            complete: (result) => {
                console.log("Parsed CSV data:", result.data); // Debugging

                const counts = result.data.reduce((acc, row) => {
                    const adm2 = row.ADM2_EN; // District column
                    const adm3 = row.ADM3_EN; // Subdistrict column
                    const sex = row.Sex; // Gender column
                    const ifCityCorp = row.CityCorporation_Area;

                    // Filter rows where ADM2_EN is "Chittagong" and ignore invalid data
                    if (adm2 === "Chittagong" && adm3 && sex) {
                        if (!acc[adm3] && ifCityCorp !== "Y") {
                            acc[adm3] = { Male: 0, Female: 0 };
                        }
                        if (ifCityCorp !== "Y" && sex === 'M') {
                            acc[adm3].Male += 1;
                        } else if (ifCityCorp !== "Y" && sex === 'F') {
                            acc[adm3].Female += 1;
                        }
                    }
                    return acc;
                }, {});

                // Convert to an array, sort by total count in descending order, and extract names
                const sortedEntries = Object.entries(counts)
                    .map(([adm3, { Male, Female }]) => ({
                        subdistrict: adm3,
                        male: Male,
                        female: Female,
                        total: Male + Female,
                    }))
                    .sort((a, b) => b.total - a.total); // Sort by total count in descending order

                // Extract sorted subdistrict names for x-axis
                const adm3Names = sortedEntries.map(entry => entry.subdistrict);
                setAdm3Data(adm3Names);

                // Convert sorted data back to an object format
                const sortedCounts = Object.fromEntries(
                    sortedEntries.map(entry => [entry.subdistrict, { Male: entry.male, Female: entry.female }])
                );
                setSexCountsByADM3(sortedCounts);

                // Format data for the DataGrid
                const rows = sortedEntries.map((entry, index) => ({
                    id: index + 1,
                    subdistrict: entry.subdistrict,
                    male: entry.male,
                    female: entry.female,
                }));

                const cols = [
                    { field: 'subdistrict', headerName: 'Sub-District', flex: 1, headerClassName: 'header-bold' },
                    { field: 'male', headerName: 'Male', flex: 1, headerClassName: 'header-bold' },
                    { field: 'female', headerName: 'Female', flex: 1, headerClassName: 'header-bold' },
                ];

                setTableRows(rows);
                setTableCols(cols);
            },
        });
    }, [setTableRows, setTableCols]);



    const data = {
        labels: adm3Data, // ADM3_EN names on the x-axis
        datasets: [
            {
                label: 'Male',
                data: adm3Data.map(adm3 => sexCountsByADM3[adm3]?.Male || 0), // Male count for each ADM3_EN
                backgroundColor: 'blue',
                borderColor: 'blue',
                borderWidth: 1,
            },
            {
                label: 'Female',
                data: adm3Data.map(adm3 => sexCountsByADM3[adm3]?.Female || 0), // Female count for each ADM3_EN
                backgroundColor: 'red',
                borderColor: 'red',
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
        <Box className="h-[98%] w-full overflow-auto">
            <h2>Division-wise Sex Distribution (Male vs Female)</h2>
            <Box className="h-full w-full flex justify-center items-center">
                <Bar data={data} options={options} />

            </Box>
        </Box>
    );
}
