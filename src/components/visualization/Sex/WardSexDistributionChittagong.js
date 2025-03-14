import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, BarElement, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, BarElement, Tooltip, Legend);

export default function WardSexDistributionChittagong({ setTableRows, setTableCols }) {
    const [wardLabels, setWardLabels] = useState([]);
    const [sexCountsByWard, setSexCountsByWard] = useState({});

    useEffect(() => {
        let wardMapping = {}; // Store Ward No. to Ward Name mapping

        // Step 1: Parse "Ward Data.csv" to create a mapping
        Papa.parse('/Ward Data.csv', {
            download: true,
            header: true,
            complete: (result) => {
                wardMapping = result.data.reduce((acc, row) => {
                    const wardNo = row["Ward No."]?.trim();
                    const wardName = row["Ward Name"]?.trim();

                    if (wardNo && wardName) {
                        acc[wardNo] = wardName;
                    }
                    return acc;
                }, {});

                // Step 2: Parse "finalData_01.csv" to count occurrences of Male and Female in each Ward
                Papa.parse('/finalData_01.csv', {
                    download: true,
                    header: true,
                    complete: (result) => {
                        const counts = result.data.reduce((acc, row) => {
                            const wardNo = row.Ward_no?.trim();
                            const isCityCorp = row.CityCorporation_Area?.trim();
                            const sex = row.Sex?.trim();

                            // Process only City Corporation wards
                            if (isCityCorp === "Y" && wardNo && sex) {
                                const wardName = wardMapping[wardNo] || `Ward ${wardNo}`;

                                if (!acc[wardName]) {
                                    acc[wardName] = { Male: 0, Female: 0 };
                                }

                                if (sex === 'M') {
                                    acc[wardName].Male += 1;
                                } else if (sex === 'F') {
                                    acc[wardName].Female += 1;
                                }
                            }

                            return acc;
                        }, {});

                        // Convert to an array, sort by total count in descending order, and extract names
                        const sortedEntries = Object.entries(counts)
                            .map(([ward, { Male, Female }]) => ({
                                ward,
                                male: Male,
                                female: Female,
                                total: Male + Female,
                            }))
                            .sort((a, b) => b.total - a.total); // Sort by total population

                        // Extract sorted ward names for x-axis
                        const sortedWards = sortedEntries.map(entry => entry.ward);
                        setWardLabels(sortedWards);

                        // Convert sorted data back to an object format
                        const sortedCounts = Object.fromEntries(
                            sortedEntries.map(entry => [entry.ward, { Male: entry.male, Female: entry.female }])
                        );
                        setSexCountsByWard(sortedCounts);

                        // Format data for the DataGrid
                        const rows = sortedEntries.map((entry, index) => ({
                            id: index + 1,
                            ward: entry.ward,
                            male: entry.male,
                            female: entry.female,
                        }));

                        const cols = [
                            { field: 'ward', headerName: 'Ward Name', flex: 1, headerClassName: 'header-bold' },
                            { field: 'male', headerName: 'Male', flex: 1, headerClassName: 'header-bold' },
                            { field: 'female', headerName: 'Female', flex: 1, headerClassName: 'header-bold' },
                        ];

                        setTableRows(rows);
                        setTableCols(cols);
                    },
                });
            },
        });
    }, [setTableRows, setTableCols]);

    const data = {
        labels: wardLabels, // Ward names on the x-axis
        datasets: [
            {
                label: 'Male',
                data: wardLabels.map(ward => sexCountsByWard[ward]?.Male || 0), // Male count for each ward
                backgroundColor: 'blue',
                borderColor: 'blue',
                borderWidth: 1,
            },
            {
                label: 'Female',
                data: wardLabels.map(ward => sexCountsByWard[ward]?.Female || 0), // Female count for each ward
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
                    text: 'Wards',
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
            <h2>Ward-wise Sex Distribution (Male vs Female)</h2>
            <Box className="h-full w-full flex justify-center items-center">
                <Bar data={data} options={options} />
            </Box>
        </Box>
    );
}
