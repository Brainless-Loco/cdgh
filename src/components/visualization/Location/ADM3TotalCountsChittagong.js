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
        Papa.parse('/finalData.csv', {
            download: true,
            header: true,
            complete: (result) => {
                console.log("Parsed CSV data:", result.data); // Debugging
    
                const counts = result.data.reduce((acc, row) => {
                    const adm2 = row.ADM2_EN; // District column
                    const adm3 = row.ADM3_EN; // Subdistrict column
    
                    // Filter rows where ADM2_EN is "Chittagong" and ignore invalid data
                    if (adm2 === "Chittagong" && adm3) {
                        if (!acc[adm3]) {
                            acc[adm3] = 0;
                        }
                        acc[adm3] += 1; // Increment total count for this subdistrict
                    }
                    return acc;
                }, {});
    
                // Set the counts for use elsewhere
                setTotalCountsByADM3(counts);
    
                // Extract ADM3_EN names for x-axis
                const adm3Names = Object.keys(counts);
                setAdm3Data(adm3Names);
    
                // Format data for the DataGrid
                const rows = adm3Names.map((adm3, index) => ({
                    id: index + 1,
                    subdistrict: adm3,
                    total: counts[adm3],
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
