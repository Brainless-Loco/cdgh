import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
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

export default function AgeDistributionChittagongCityCorp({ setTableRows, setTableCols }) {
    const [wardLabels, setWardLabels] = useState([]);
    const [ageCategoryCounts, setAgeCategoryCounts] = useState({});

    useEffect(() => {
        let wardMapping = {};

        Papa.parse('/Ward Data.csv', {
            download: true,
            header: true,
            complete: (result) => {
                wardMapping = result.data.reduce((acc, row) => {
                    const wardNo = row["Ward No."]?.trim();
                    const wardName = row["Ward Name"]?.trim();
                    if (wardNo && wardName) acc[wardNo] = wardName;
                    return acc;
                }, {});

                Papa.parse('/finalData_01.csv', {
                    download: true,
                    header: true,
                    complete: (result) => {
                        const ageCounts = result.data.reduce((acc, row) => {
                            const wardNo = row.Ward_no?.trim();
                            const isCityCorp = row.CityCorporation_Area?.trim();
                            const age = parseInt(row.Age, 10);
                            const sex = row.Sex;

                            if (isCityCorp === "Y" && wardNo && !isNaN(age) && sex) {
                                const wardName = wardMapping[wardNo] || `Ward ${wardNo}`;

                                if (!acc[wardName]) {
                                    acc[wardName] = {
                                        'Non-Adults': { Male: 0, Female: 0 },
                                        'Adults': { Male: 0, Female: 0 },
                                        'Mature Working Aged': { Male: 0, Female: 0 },
                                        'Elderly': { Male: 0, Female: 0 },
                                    };
                                }

                                let category = '';
                                if (age < 18) category = 'Non-Adults';
                                else if (age <= 40) category = 'Adults';
                                else if (age <= 60) category = 'Mature Working Aged';
                                else category = 'Elderly';

                                if (sex === 'M') acc[wardName][category].Male++;
                                else if (sex === 'F') acc[wardName][category].Female++;
                            }

                            return acc;
                        }, {});

                        const sortedEntries = Object.entries(ageCounts).sort((a, b) => {
                            const totalA = Object.values(a[1]).reduce((sum, val) => sum + val.Male + val.Female, 0);
                            const totalB = Object.values(b[1]).reduce((sum, val) => sum + val.Male + val.Female, 0);
                            return totalB - totalA;
                        });

                        const sortedWards = sortedEntries.map(entry => entry[0]);
                        const sortedCounts = Object.fromEntries(sortedEntries);

                        setWardLabels(sortedWards);
                        setAgeCategoryCounts(sortedCounts);

                        const tableRows = [];
                        let rowId = 0;
                        sortedEntries.forEach(([ward, ageGroups]) => {
                            Object.entries(ageGroups).forEach(([category, counts]) => {
                                tableRows.push({
                                    id: rowId++,
                                    ward,
                                    ageGroup: category,
                                    count: counts.Male + counts.Female,
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

    const makeDataset = (label, color, key) => ({
        label,
        data: wardLabels.map(ward => {
            const group = ageCategoryCounts[ward]?.[key];
            return (group?.Male || 0) + (group?.Female || 0);
        }),
        borderColor: color,
        backgroundColor: color,
        fill: false,
        tension: 0.2,
    });

    const data = {
        labels: wardLabels,
        datasets: [
            makeDataset('Non-Adults', 'green', 'Non-Adults'),
            makeDataset('Adults', 'blue', 'Adults'),
            makeDataset('Mature Working Aged', 'red', 'Mature Working Aged'),
            makeDataset('Elderly', 'orange', 'Elderly'),
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const ward = context.label;
                        const datasetLabel = context.dataset.label;
                        const groupKey = datasetLabel;
                        const counts = ageCategoryCounts[ward]?.[groupKey] || { Male: 0, Female: 0 };
                        const male = counts.Male || 0;
                        const female = counts.Female || 0;
                        const total = male + female;
                        const malePct = total ? ((male / total) * 100).toFixed(1) : 0;
                        const femalePct = total ? ((female / total) * 100).toFixed(1) : 0;

                        return [
                            `${datasetLabel}: ${total} people`,
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
