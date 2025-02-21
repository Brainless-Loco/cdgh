import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SexCategoryOverallInBangladeshPieChart({setTableRows, setTableCols}) {
    const [sexCounts, setSexCounts] = useState({ Male: 0, Female: 0, Others: 0 });
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        // Parse finalData.csv to count occurrences of each sex category
        Papa.parse('/finalData.csv', {
            download: true,
            header: true,
            complete: (result) => {
                const counts = result.data.reduce((acc, row) => {
                    const sex = row.Sex; // Assuming 'Sex' is the column for gender
                    
                    // Only consider valid categories: M, F, O
                    if (sex === 'M') {
                        acc.Male += 1;
                    } else if (sex === 'F') {
                        acc.Female += 1;
                    } else if (sex === 'O') {
                        acc.Others += 1;
                    }
                    return acc;
                }, { Male: 0, Female: 0, Others: 0 });
    
                setSexCounts(counts);
                setTotalCount(counts.Male + counts.Female + counts.Others); // Calculate total count
    
                // Set rows and columns for DataGrid
                setTableRows([
                    { id: 1, category: 'Male', count: counts.Male },
                    { id: 2, category: 'Female', count: counts.Female },
                    { id: 3, category: 'Others', count: counts.Others },
                ]);
    
                setTableCols([
                    { field: 'id', headerName: 'ID', flex: 0.5 },
                    { field: 'category', headerName: 'Category', flex: 1 },
                    { field: 'count', headerName: 'Count', flex: 1 },
                ]);
            },
        });
    }, [setTableRows, setTableCols]);


    const data = {
        labels: ['Male', 'Female', 'Others'],
        datasets: [
            {
                data: [sexCounts.Male, sexCounts.Female, sexCounts.Others],
                backgroundColor: ["#2200ff", "#ff0000", '#f6ff00'],
                borderColor: ['#fff', '#fff', '#fff'],
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
                        const percentage = ((value / totalCount) * 100).toFixed(2); // Calculate percentage
                        return `${tooltipItem.label}: ${value} (${percentage}%)`;
                    },
                },
            },
            legend: {
                position: 'top',
            },
        },
    };

    return (
        <Box className="h-full w-full">
            <h1 className='text-center'>Overall Sex Distribution of Patients in Bangladesh</h1>
            <Box className="h-[90%] w-full overflow-hidden flex justify-center">
                <Pie data={data} options={options} />   
            </Box>
        </Box>
    );
}
