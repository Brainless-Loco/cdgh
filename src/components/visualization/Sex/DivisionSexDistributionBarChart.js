import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, BarElement, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, BarElement, Tooltip, Legend);

export default function DivisionSexDistributionBarChart({setTableRows, setTableCols}) {
    const [divisionData, setDivisionData] = useState([]);
    const [sexCountsByDivision, setSexCountsByDivision] = useState({});

    useEffect(() => {
        // Parse finalData.csv to count occurrences of male and female for each division
        Papa.parse('/finalData.csv', {
            download: true,
            header: true,
            complete: (result) => {
                const counts = result.data.reduce((acc, row) => {
                    const division = row.ADM1_EN;  // Assuming 'Division' is the column for division name
                    const sex = row.Sex;  // 'Sex' column can be 'M', 'F', or 'O'
    
                    if (!division || !sex || sex === 'O' || sex === '') return acc; // Exclude unknown or blank sex values
    
                    if (!acc[division]) {
                        acc[division] = { Male: 0, Female: 0 };
                    }
    
                    if (sex === 'M') {
                        acc[division].Male += 1;
                    } else if (sex === 'F') {
                        acc[division].Female += 1;
                    }
    
                    return acc;
                }, {});
    
                console.log("Sex counts by division:", counts);  // Debug: check counts per division
                setSexCountsByDivision(counts);
    
                // Extract division names for x-axis
                const divisions = Object.keys(counts);
                setDivisionData(divisions);
    
                // Set rows for DataGrid
                const rows = divisions
                .filter((division) => division !== 'Unknown') // Exclude "Unknown"
                .map((division, index) => ({
                    id: index + 1,
                    division: division,
                    male: counts[division].Male,
                    female: counts[division].Female,
                }));

                setTableRows(rows);
    
                // Set columns for DataGrid
                setTableCols([
                    { field: 'division', headerName: 'Division', flex: 1 },
                    { field: 'male', headerName: 'Male Count', flex: 1 },
                    { field: 'female', headerName: 'Female Count', flex: 1 },
                ]);
            },
        });
    }, [setTableRows, setTableCols]);
    

    // Debug: check if division data is available and counts are correct
    useEffect(() => {
        console.log("Division data:", divisionData);
        console.log("Sex counts:", sexCountsByDivision);
    }, [divisionData, sexCountsByDivision]);

    const data = {
        labels: divisionData,  // Division names on the x-axis
        datasets: [
            {
                label: 'Male',
                data: divisionData.map(division => sexCountsByDivision[division]?.Male || 0),  // Male count for each division
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: 'Female',
                data: divisionData.map(division => sexCountsByDivision[division]?.Female || 0),  // Female count for each division
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
                    text: 'Division',
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
        <Box className="w-[95%] h-[90%]">
            <h2>Division-wise Sex Distribution (Male vs Female)</h2>
            <Bar data={data} options={options} />
        </Box>
    );
}
