import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function AgeCategoryLineGraphChittagong({ setTableRows, setTableCols }) {
    const [ageCategoryData, setAgeCategoryData] = useState({});

    useEffect(() => {
        Papa.parse('/finalData_01.csv', {
            download: true,
            header: true,
            complete: (result) => {
                const data = result.data.filter((row) => row.ADM2_EN === 'Chittagong');

                const categorized = {};

                data.forEach((row) => {
                    const subdistrict = row.ADM3_EN;
                    const age = parseInt(row.Age, 10);
                    const sex = row.Sex;
                    const isCityCorp = row.CityCorporation_Area;

                    if (!subdistrict || isNaN(age) || isCityCorp === 'Y' || !sex) return;

                    if (!categorized[subdistrict]) {
                        categorized[subdistrict] = {
                            'Non-Adults': { Male: 0, Female: 0 },
                            'Adults': { Male: 0, Female: 0 },
                            'Mature Working Aged': { Male: 0, Female: 0 },
                            'Elderly': { Male: 0, Female: 0 },
                            total: 0,
                        };
                    }

                    let category = '';
                    if (age < 18) category = 'Non-Adults';
                    else if (age <= 40) category = 'Adults';
                    else if (age <= 60) category = 'Mature Working Aged';
                    else category = 'Elderly';

                    if (sex === 'M') categorized[subdistrict][category].Male++;
                    else if (sex === 'F') categorized[subdistrict][category].Female++;

                    categorized[subdistrict].total++;
                });

                const sortedEntries = Object.entries(categorized).sort((a, b) => b[1].total - a[1].total);
                const sortedData = Object.fromEntries(sortedEntries);

                setAgeCategoryData(sortedData);

                const tableRows = [];
                let id = 0;
                sortedEntries.forEach(([subdistrict, data]) => {
                    ['Non-Adults', 'Adults', 'Mature Working Aged', 'Elderly'].forEach((group) => {
                        const { Male, Female } = data[group];
                        tableRows.push({
                            id: id++,
                            subdistrict,
                            ageGroup: group,
                            male: Male,
                            female: Female,
                            total: Male + Female,
                        });
                    });
                });

                setTableRows(tableRows);
                setTableCols([
                    { field: 'subdistrict', headerName: 'Subdistrict', flex: 1 },
                    { field: 'ageGroup', headerName: 'Age Group', flex: 1 },
                    { field: 'male', headerName: 'Male', flex: 1 },
                    { field: 'female', headerName: 'Female', flex: 1 },
                    { field: 'total', headerName: 'Total', flex: 1 },
                ]);
            },
        });
    }, [setTableRows, setTableCols]);

    const labels = Object.keys(ageCategoryData);

    const makeDataset = (label, color, groupKey) => ({
        label,
        data: labels.map((subdistrict) => {
            const group = ageCategoryData[subdistrict]?.[groupKey];
            return (group?.Male || 0) + (group?.Female || 0);
        }),
        borderColor: color,
        backgroundColor: color,
        tension: 0,
        fill: false,
    });

    const data = {
        labels,
        datasets: [
            makeDataset('Non-Adults (0-18)', 'green', 'Non-Adults'),
            makeDataset('Adults (18-40)', 'blue', 'Adults'),
            makeDataset('Mature Working Aged (41-60)', 'red', 'Mature Working Aged'),
            makeDataset('Elderly (60+)', 'orange', 'Elderly'),
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const subdistrict = context.label;
                        const ageGroup = context.dataset.label.split(' ')[0]; // matches 'Non-Adults' etc.
                        const key = ageGroup === 'Mature' ? 'Mature Working Aged' : ageGroup; // special case

                        const groupData = ageCategoryData[subdistrict]?.[key] || { Male: 0, Female: 0 };
                        const male = groupData.Male || 0;
                        const female = groupData.Female || 0;
                        const total = male + female;
                        const malePct = total ? ((male / total) * 100).toFixed(1) : 0;
                        const femalePct = total ? ((female / total) * 100).toFixed(1) : 0;

                        return [
                            `${context.dataset.label}: ${total} people`,
                            `↳ Male: ${male} (${malePct}%)`,
                            `↳ Female: ${female} (${femalePct}%)`
                        ];
                    },
                },
            },
            legend: {
                position: 'top',
            },
        },
        scales: {
            x: {
                title: { display: true, text: 'Subdistricts' },
                ticks: { maxRotation: 90, minRotation: 90 },
            },
            y: {
                title: { display: true, text: 'Number of Patients' },
                beginAtZero: true,
            },
        },
    };

    return (
        <Box className="h-full w-full">
            <Typography variant="h6" className="mb-2">
                Age Distribution by Subdistrict (Chittagong District)
            </Typography>
            <Box className="h-[95%] w-full overflow-hidden flex justify-center">
                <Line data={data} options={options} />
            </Box>
        </Box>
    );
}
