import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function AgeCategoryLineGraphChittagong({setTableRows, setTableCols}) {
    const [ageCategoryData, setAgeCategoryData] = useState({});

    useEffect(() => {
        // Parse finalData.csv to categorize and count patients by age for each subdistrict
        Papa.parse('/finalData.csv', {
            download: true,
            header: true,
            complete: (result) => {
                const data = result.data.filter((row) => row.ADM2_EN === 'Chittagong'); // Filter for Chittagong subdistricts
                const subdistricts = data.reduce((acc, row) => {
                    const subdistrict = row.ADM3_EN; // Subdistrict column
                    const age = parseInt(row.Age, 10);
    
                    if (!subdistrict || isNaN(age)) return acc;
    
                    if (!acc[subdistrict]) {
                        acc[subdistrict] = {
                            'Non-Adults': 0,
                            'Adults': 0,
                            'Mature Working Aged': 0,
                            Elderly: 0,
                        };
                    }
    
                    if (age >= 0 && age < 18) acc[subdistrict]["Non-Adults"] += 1;
                    else if (age >= 18 && age <= 40) acc[subdistrict]['Adults'] += 1;
                    else if (age >= 41 && age <= 60) acc[subdistrict]['Mature Working Aged'] += 1;
                    else if (age >= 60) acc[subdistrict].Elderly += 1;
    
                    return acc;
                }, {});
    
                // Set the categorized data for age groups in subdistricts
                setAgeCategoryData(subdistricts);
    
                // Prepare table rows for display
                const tableRows = [];
                let rowId = 0; // Counter for unique row ID
    
                Object.keys(subdistricts).forEach((subdistrict) => {
                    const subdistrictData = subdistricts[subdistrict];
                    Object.keys(subdistrictData).forEach((ageGroup) => {
                        tableRows.push({
                            id: rowId++, // Unique row ID
                            subdistrict: subdistrict,
                            ageGroup: ageGroup,
                            count: subdistrictData[ageGroup],
                        });
                    });
                });
    
                // Define table columns
                const tableCols = [
                    { field: 'subdistrict', headerName: 'Subdistrict', flex:1 },
                    { field: 'ageGroup', headerName: 'Age Group', flex:1 },
                    { field: 'count', headerName: 'Count', flex:1 },
                ];
    
                // Set the table rows and columns to state
                setTableRows(tableRows);
                setTableCols(tableCols);
            },
        });
    }, [setTableRows, setTableCols]);
    

    const labels = Object.keys(ageCategoryData); // Subdistrict names
    const data = {
        labels,
        datasets: [
            {
                label: 'Non-Adults (0-18)',
                data: labels.map((subdistrict) => ageCategoryData[subdistrict]?.['Non-Adults'] || 0),
                borderColor: 'green',
                backgroundColor: 'green',
                tension: 0, // Straight lines
                fill: false,
            },
            {
                label: 'Adults (18-40)',
                data: labels.map((subdistrict) => ageCategoryData[subdistrict]?.['Adults'] || 0),
                borderColor: 'blue',
                backgroundColor: 'blue',
                tension: 0, // Straight lines
                fill: false,
            },
            {
                label: 'Mature Working Aged (41-60)',
                data: labels.map((subdistrict) => ageCategoryData[subdistrict]?.['Mature Working Aged'] || 0),
                borderColor: 'red',
                backgroundColor: 'red',
                tension: 0, // Straight lines
                fill: false,
            },
            {
                label: 'Elderly (60+)',
                data: labels.map((subdistrict) => ageCategoryData[subdistrict]?.Elderly || 0),
                borderColor: 'yellow',
                backgroundColor: 'yellow',
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
                    text: 'Subdistricts',
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
        <Box className="h-full w-full">
            <Typography variant="h5">Age Distribution by Subdistrict (Chittagong District)</Typography>
            <Box className="h-[90%] w-full overflow-hidden flex justify-center">
                <Line data={data} options={options} />
            </Box>
        </Box>
    );
}
