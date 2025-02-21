import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AgeCategoryDistributionPieChart({setTableRows, setTableCols}) {
    const [ageCounts, setAgeCounts] = useState({
        "Non-adults": 0,
        'Adults': 0,
        'Mature Working Aged': 0,
        Elderly: 0,
    });

    useEffect(() => {
        // Parse finalData.csv to categorize and count patients by age
        Papa.parse('/finalData.csv', {
            download: true,
            header: true,
            complete: (result) => {
                const counts = result.data.reduce((acc, row) => {
                    const age = parseInt(row.Age, 10);
                    if (!isNaN(age)) {
                        if (age >= 0 && age < 18) acc["Non-adults"] += 1;
                        else if (age >= 18 && age <= 40) acc['Adults'] += 1;
                        else if (age >= 41 && age <= 60) acc['Mature Working Aged'] += 1;
                        else if (age >= 61) acc.Elderly += 1;
                    }
                    return acc;
                }, {
                    "Non-adults": 0,
                    'Adults': 0,
                    'Mature Working Aged': 0,
                    Elderly: 0,
                });
    
                // Set age counts to state
                setAgeCounts(counts);
    
                // Prepare data for the table
                const tableRows = [];
                let rowId = 0; // Initialize row counter for unique IDs
    
                // Loop through the categories and create a row for each
                Object.keys(counts).forEach((ageGroup) => {
                    tableRows.push({
                        id: rowId++, // Unique ID for each row
                        ageGroup: ageGroup,
                        count: counts[ageGroup],
                    });
                });
    
                // Define the columns for the table
                const tableCols = [
                    { field: 'ageGroup', headerName: 'Age Group', flex:1 },
                    { field: 'count', headerName: 'Count', flex:1 },
                ];
    
                // Set the table rows and columns to state
                setTableRows(tableRows);
                setTableCols(tableCols);
            },
        });
    }, [setTableRows, setTableCols]);
    
    const data = {
        labels: [
            'Non-Adults (0-18)',
            'Adults (18-40)',
            'Mature Working Aged (41-60)',
            'Elderly (60+)',
        ],
        datasets: [
            {
                data: Object.values(ageCounts),
                backgroundColor: [
                    'purple',  // Non-Adults
                    'red',  // Adults
                    'blue', // Mature Working Age
                    'yellow',  // Elderly
                ],
                borderColor: ['#fff', '#fff', '#fff', '#fff', '#fff'],
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
                        const count = tooltipItem.raw;
                        const total = Object.values(ageCounts).reduce((sum, c) => sum + c, 0);
                        const percentage = ((count / total) * 100).toFixed(2);
                        return `${tooltipItem.label}: ${count} (${percentage}%)`;
                    },
                },
            },
            legend: {
                position: 'top',
            },
        },
    };

    return (
        <Box>
            <Typography variant="h5">Age Distribution of Patients in Bangladesh</Typography>
            <Pie data={data} options={options} />
        </Box>
    );
}
