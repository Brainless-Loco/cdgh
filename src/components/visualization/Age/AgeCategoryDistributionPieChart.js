import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AgeCategoryDistributionPieChart({setTableRows, setTableCols}) {
    const [ageCounts, setAgeCounts] = useState({
        Children: 0,
        'Early Working Age': 0,
        'Prime Working Age': 0,
        'Mature Working Age': 0,
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
                        if (age >= 0 && age <= 14) acc.Children += 1;
                        else if (age >= 15 && age <= 24) acc['Early Working Age'] += 1;
                        else if (age >= 25 && age <= 54) acc['Prime Working Age'] += 1;
                        else if (age >= 55 && age <= 64) acc['Mature Working Age'] += 1;
                        else if (age >= 65) acc.Elderly += 1;
                    }
                    return acc;
                }, {
                    Children: 0,
                    'Early Working Age': 0,
                    'Prime Working Age': 0,
                    'Mature Working Age': 0,
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
            'Children (0-14)',
            'Early Working Age (15-24)',
            'Prime Working Age (25-54)',
            'Mature Working Age (55-64)',
            'Elderly (65+)',
        ],
        datasets: [
            {
                data: Object.values(ageCounts),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)',  // Children
                    'rgba(54, 162, 235, 0.7)',  // Early Working Age
                    'rgba(255, 206, 86, 0.7)',  // Prime Working Age
                    'rgba(153, 102, 255, 0.7)', // Mature Working Age
                    'rgba(255, 99, 132, 0.7)',  // Elderly
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
