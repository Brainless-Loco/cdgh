import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function AgeDistributionChittagongCityCorp({ setTableRows, setTableCols }) {
    const [wardLabels, setWardLabels] = useState([]);
    const [ageCategoryCounts, setAgeCategoryCounts] = useState({});

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

                // Step 2: Parse "finalData_01.csv" to categorize age groups for each ward
                Papa.parse('/finalData_01.csv', {
                    download: true,
                    header: true,
                    complete: (result) => {
                        const ageCounts = result.data.reduce((acc, row) => {
                            const wardNo = row.Ward_no?.trim();
                            const isCityCorp = row.CityCorporation_Area?.trim();
                            const age = parseInt(row.Age, 10);

                            if (isCityCorp === "Y" && wardNo && !isNaN(age)) {
                                const wardName = wardMapping[wardNo] || `Ward ${wardNo}`;

                                if (!acc[wardName]) {
                                    acc[wardName] = {
                                        'Non-Adults': 0,
                                        'Adults': 0,
                                        'Mature Working Aged': 0,
                                        'Elderly': 0,
                                    };
                                }

                                if (age >= 0 && age < 18) acc[wardName]["Non-Adults"] += 1;
                                else if (age >= 18 && age <= 40) acc[wardName]['Adults'] += 1;
                                else if (age >= 41 && age <= 60) acc[wardName]['Mature Working Aged'] += 1;
                                else if (age >= 60) acc[wardName].Elderly += 1;
                            }

                            return acc;
                        }, {});

                        // Sort wards by total population
                        const sortedEntries = Object.entries(ageCounts).sort((a, b) => {
                            const totalA = Object.values(a[1]).reduce((sum, val) => sum + val, 0);
                            const totalB = Object.values(b[1]).reduce((sum, val) => sum + val, 0);
                            return totalB - totalA; // Descending order
                        });

                        // Extract ward names and counts
                        const sortedWards = sortedEntries.map(entry => entry[0]);
                        const sortedCounts = Object.fromEntries(sortedEntries);

                        setWardLabels(sortedWards);
                        setAgeCategoryCounts(sortedCounts);

                        // Prepare table data
                        const tableRows = [];
                        let rowId = 0;
                        sortedEntries.forEach(([ward, ageGroups]) => {
                            Object.keys(ageGroups).forEach((category) => {
                                tableRows.push({
                                    id: rowId++,
                                    ward: ward,
                                    ageGroup: category,
                                    count: ageGroups[category],
                                });
                            });
                        });

                        const tableCols = [
                            { field: 'ward', headerName: 'Ward Name', flex: 1 },
                            { field: 'ageGroup', headerName: 'Age Group', flex: 1 },
                            { field: 'count', headerName: 'Count', flex: 1 },
                        ];

                        setTableRows(tableRows);
                        setTableCols(tableCols);
                    },
                });
            },
        });
    }, [setTableRows, setTableCols]);

    const data = {
        labels: wardLabels,
        datasets: [
            {
                label: 'Non-Adults',
                data: wardLabels.map(ward => ageCategoryCounts[ward]?.['Non-Adults'] || 0),
                borderColor: 'green',
                backgroundColor: 'green',
                fill: false,
            },
            {
                label: 'Adults',
                data: wardLabels.map(ward => ageCategoryCounts[ward]?.['Adults'] || 0),
                borderColor: 'blue',
                backgroundColor: 'blue',
                fill: false,
            },
            {
                label: 'Mature Working Aged',
                data: wardLabels.map(ward => ageCategoryCounts[ward]?.['Mature Working Aged'] || 0),
                borderColor: 'red',
                backgroundColor: 'red',
                fill: false,
            },
            {
                label: 'Elderly',
                data: wardLabels.map(ward => ageCategoryCounts[ward]?.Elderly || 0),
                borderColor: 'yellow',
                backgroundColor: 'yellow',
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
                title: { display: true, text: 'Wards' },
                ticks: { maxRotation: 45, minRotation: 45 },
            },
            y: {
                title: { display: true, text: 'Patient Count' },
                beginAtZero: true,
            },
        },
    };

    return (
        <Box className="h-full w-full">
            <Box className="h-[97%] w-full flex justify-center items-center">
                <Line data={data} options={options} />
            </Box>
        </Box>
    );
}
