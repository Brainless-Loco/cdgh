import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, BarElement, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, BarElement, Tooltip, Legend);

export default function ADM3TotalCountsChittagong({ setTableRows, setTableCols }) {
    const [adm3Data, setAdm3Data] = useState([]);
    const [totalCountsByADM3, setTotalCountsByADM3] = useState({});

    useEffect(() => {
        // Parse finalData.csv to count total occurrences for each ADM3_EN in Chittagong
        Papa.parse('/finalData_01.csv', {
            download: true,
            header: true,
            complete: (result) => {
                console.log("Parsed CSV data:", result.data); // Debugging

                const counts = result.data.reduce((acc, row) => {
                    const adm2 = row.ADM2_EN; // District column
                    const adm3 = row.ADM3_EN; // Subdistrict column
                    const ifCityCorp = row.CityCorporation_Area;

                    // Filter rows where ADM2_EN is "Chittagong" and ignore invalid data
                    if (adm2 === "Chittagong" && adm3) {
                        if (!acc[adm3] && ifCityCorp === "N") {
                            acc[adm3] = 0;
                        }
                        if(ifCityCorp === "N") acc[adm3] += 1; // Increment total count for this subdistrict
                    }
                    return acc;
                }, {});

                // Convert to an array and sort by count in descending order
                const sortedEntries = Object.entries(counts)
                    .sort((a, b) => a[1] - b[1]); // Sorting by count

                // Extract sorted ADM3_EN names and counts
                const adm3Names = sortedEntries.map(entry => entry[0]);
                const sortedCounts = Object.fromEntries(sortedEntries); // Convert back to an object

                setTotalCountsByADM3(sortedCounts);
                setAdm3Data(adm3Names);

                // Format data for the DataGrid
                const rows = sortedEntries.map(([adm3, total], index) => ({
                    id: index + 1,
                    subdistrict: adm3,
                    total: total,
                }));

                const cols = [
                    { field: 'subdistrict', headerName: 'Sub-District', flex: 1, headerClassName: 'header-bold' },
                    { field: 'total', headerName: 'Total', flex: 1, headerClassName: 'header-bold' },
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
                label: 'Total Patients',
                data: adm3Data.map(adm3 => totalCountsByADM3[adm3] || 0), // Total count for each ADM3_EN
                backgroundColor: '#2200ff',
                borderColor: '#2200ff',
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
                        return `Total: ${value}`;
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
                ticks: {
                    maxRotation: 45, // Maximum rotation angle
                    minRotation: 45, // Minimum rotation angle
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
        <Box className="h-[full] w-full">
            {/* <Typography variant='h5'>Total Patients by Subdistricts in Chittagong</Typography> */}
            <Box className="h-[90%] w-full flex justify-center items-center">
                <Bar data={data} options={options} />
            </Box>
        </Box>
    );
}
