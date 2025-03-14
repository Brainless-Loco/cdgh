import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function WardTotalCountsChittagong({ setTableRows, setTableCols }) {
    const [wardData, setWardData] = useState([]);
    const [totalCountsByWard, setTotalCountsByWard] = useState({});

    useEffect(() => {
        let wardMapping = {}; // Store Ward No. to Ward Name mapping

        // Step 1: Parse "Ward Data.csv" to create a mapping
        Papa.parse('/Ward Data.csv', {
            download: true,
            header: true,
            complete: (result) => {
                wardMapping = result.data.reduce((acc, row) => {
                    if (row["Ward No."] && row["Ward Name"]) {
                        acc[row["Ward No."].trim()] = row["Ward Name"].trim();
                    }
                    return acc;
                }, {});

                // Step 2: Parse "finalData_01.csv" and count patients by ward
                Papa.parse('/finalData_01.csv', {
                    download: true,
                    header: true,
                    complete: (result) => {
                        console.log("Parsed CSV data:", result.data); // Debugging

                        const counts = result.data.reduce((acc, row) => {
                            const wardNo = row.Ward_no?.trim(); // Ward number
                            const isCityCorp = row.CityCorporation_Area?.trim(); // Y/N flag

                            // Filter only city corporation areas
                            if (isCityCorp === "Y" && wardNo) {
                                const wardName = wardMapping[wardNo] || `Ward ${wardNo}`; // Default if missing

                                if (!acc[wardName]) acc[wardName] = 0;
                                acc[wardName] += 1;
                            }
                            return acc;
                        }, {});

                        // Convert to sorted array
                        const sortedEntries = Object.entries(counts).sort((a, b) => b[1] - a[1]); // Sort by count desc

                        // Extract labels and counts
                        const wardNames = sortedEntries.map(entry => entry[0]);
                        const sortedCounts = Object.fromEntries(sortedEntries);

                        setTotalCountsByWard(sortedCounts);
                        setWardData(wardNames);

                        // Prepare table data
                        const rows = sortedEntries.map(([ward, total], index) => ({
                            id: index + 1,
                            ward: ward,
                            total: total,
                        }));

                        const cols = [
                            { field: 'ward', headerName: 'Ward Name', flex: 1, headerClassName: 'header-bold' },
                            { field: 'total', headerName: 'Total Patients', flex: 1, headerClassName: 'header-bold' },
                        ];

                        setTableRows(rows);
                        setTableCols(cols);
                    },
                });
            },
        });
    }, [setTableRows, setTableCols]);

    const data = {
        labels: wardData,
        datasets: [
            {
                label: 'Total Patients',
                data: wardData.map(ward => totalCountsByWard[ward] || 0),
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
                    label: (tooltipItem) => `Total: ${tooltipItem.raw}`,
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
            <Box className="h-[95%] w-full flex justify-center items-center">
                <Bar data={data} options={options} />
            </Box>
        </Box>
    );
}
