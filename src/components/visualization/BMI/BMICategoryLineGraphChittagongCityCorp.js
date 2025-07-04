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

export default function BMICategoryLineGraphChittagongCityCorp({ setTableRows, setTableCols }) {
    const [bmiData, setBmiData] = useState({});
    const [wardLabels, setWardLabels] = useState([]);
    const [bmiCategories, setBmiCategories] = useState([]);

    const colorPalette = [
        '#e53935', '#f57c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa',
        '#6d4c41', '#00897b', '#5e35b1', '#3949ab', '#00acc1', '#d81b60'
    ];

    useEffect(() => {
        let wardMapping = {};

        Papa.parse('/Ward Data.csv', {
            download: true,
            header: true,
            complete: (res) => {
                wardMapping = res.data.reduce((acc, row) => {
                    const wardNo = row["Ward No."]?.trim();
                    const wardName = row["Ward Name"]?.trim();
                    if (wardNo && wardName) acc[wardNo] = wardName;
                    return acc;
                }, {});

                Papa.parse('/finalData_01.csv', {
                    download: true,
                    header: true,
                    complete: (result) => {
                        const data = result.data.filter(row => row.CityCorporation_Area === 'Y');

                        const categorized = {};
                        const uniqueCategories = new Set();

                        data.forEach(row => {
                            const wardNo = row.Ward_no?.trim();
                            const category = row['BMI Category'];
                            const sex = row['Sex'];

                            if (!wardNo || !category || !sex) return;

                            const ward = wardMapping[wardNo] || `Ward ${wardNo}`;
                            uniqueCategories.add(category);

                            if (!categorized[ward]) categorized[ward] = {};
                            if (!categorized[ward][category]) categorized[ward][category] = { Male: 0, Female: 0 };

                            if (sex === 'M') categorized[ward][category].Male++;
                            else if (sex === 'F') categorized[ward][category].Female++;
                        });

                        const sortedEntries = Object.entries(categorized).sort((a, b) => {
                            const sum = obj => Object.values(obj).reduce((s, c) => s + c.Male + c.Female, 0);
                            return sum(b[1]) - sum(a[1]);
                        });

                        const sortedWards = sortedEntries.map(([ward]) => ward);
                        setWardLabels(sortedWards);
                        setBmiData(Object.fromEntries(sortedEntries));
                        setBmiCategories(Array.from(uniqueCategories));

                        const rows = [];
                        let id = 1;
                        sortedEntries.forEach(([ward, cats]) => {
                            Object.entries(cats).forEach(([cat, counts]) => {
                                rows.push({
                                    id: id++,
                                    ward,
                                    bmiCategory: cat,
                                    male: counts.Male,
                                    female: counts.Female,
                                    total: counts.Male + counts.Female
                                });
                            });
                        });

                        setTableRows(rows);
                        setTableCols([
                            { field: 'ward', headerName: 'Ward', flex: 1 },
                            { field: 'bmiCategory', headerName: 'BMI Category', flex: 1 },
                            { field: 'male', headerName: 'Male', flex: 1 },
                            { field: 'female', headerName: 'Female', flex: 1 },
                            { field: 'total', headerName: 'Total', flex: 1 }
                        ]);
                    }
                });
            }
        });
    }, [setTableRows, setTableCols]);

    const colorMap = {};
    bmiCategories.forEach((cat, index) => {
        colorMap[cat] = colorPalette[index % colorPalette.length];
    });

    const datasets = bmiCategories.map(category => ({
        label: category,
        data: wardLabels.map(ward => {
            const male = bmiData[ward]?.[category]?.Male || 0;
            const female = bmiData[ward]?.[category]?.Female || 0;
            return male + female;
        }),
        borderColor: colorMap[category],
        backgroundColor: colorMap[category],
        tension: 0.2,
        fill: false
    }));

    const chartData = { labels: wardLabels, datasets };

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (ctx) {
                        const ward = chartData.labels[ctx.dataIndex];
                        const category = ctx.dataset.label;
                        const male = bmiData[ward]?.[category]?.Male || 0;
                        const female = bmiData[ward]?.[category]?.Female || 0;
                        const total = male + female;
                        const malePct = total ? ((male / total) * 100).toFixed(1) : 0;
                        const femalePct = total ? ((female / total) * 100).toFixed(1) : 0;

                        return [
                            `${category}: ${total} people`,
                            `↳ Male: ${male} (${malePct}%)`,
                            `↳ Female: ${female} (${femalePct}%)`
                        ];
                    }
                }
            },
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    font: {
                        weight: 'bold'
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of People'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Wards'
                },
                ticks: {
                    maxRotation: 90,
                    minRotation: 90
                }
            }
        }
    };

    return (
        <Box className="h-full w-full">
            <Typography variant="h6" className="mb-2">
                BMI Category Distribution by Ward (Chittagong City Corporation)
            </Typography>
            <Box className="h-[95%] w-full overflow-hidden flex justify-center">
                <Line data={chartData} options={options} />
            </Box>
        </Box>
    );
}
