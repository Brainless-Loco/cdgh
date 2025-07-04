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

export default function HeightCategoryLineGraphChittagongCityCorp({ setTableRows, setTableCols }) {
    const [heightData, setHeightData] = useState({});
    const [wardLabels, setWardLabels] = useState([]);

    const categoryOrder = ['Very Short', 'Short', 'Below Average', 'Average', 'Above Average', 'Tall', 'Very Tall'];

    const baseColors = {
        'Very Short': '#d32f2f',
        'Short': '#f57c00',
        'Below Average': '#fbc02d',
        'Average': '#388e3c',
        'Above Average': '#1976d2',
        'Tall': '#7b1fa2',
        'Very Tall': '#455a64'
    };

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

                        data.forEach(row => {
                            const wardNo = row.Ward_no?.trim();
                            const height = parseFloat(row['HEIGHT(CM)']);
                            const sex = row['Sex'];

                            if (!wardNo || isNaN(height) || !sex) return;

                            const ward = wardMapping[wardNo] || `Ward ${wardNo}`;

                            let category = 'Others';
                            if (height < 140) category = 'Very Short';
                            else if (height < 150) category = 'Short';
                            else if (height < 160) category = 'Below Average';
                            else if (height < 170) category = 'Average';
                            else if (height < 180) category = 'Above Average';
                            else if (height < 190) category = 'Tall';
                            else category = 'Very Tall';

                            if (!categorized[ward]) categorized[ward] = {};
                            if (!categorized[ward][category]) categorized[ward][category] = { Male: 0, Female: 0 };

                            if (sex === 'M') categorized[ward][category].Male++;
                            else if (sex === 'F') categorized[ward][category].Female++;
                        });

                        // Sort wards by total counts
                        const sortedEntries = Object.entries(categorized).sort((a, b) => {
                            const sum = obj => Object.values(obj).reduce((s, c) => s + c.Male + c.Female, 0);
                            return sum(b[1]) - sum(a[1]);
                        });

                        const sortedWards = sortedEntries.map(([ward]) => ward);
                        setWardLabels(sortedWards);
                        setHeightData(Object.fromEntries(sortedEntries));

                        const rows = [];
                        let id = 1;
                        sortedEntries.forEach(([ward, cats]) => {
                            Object.entries(cats).forEach(([cat, counts]) => {
                                rows.push({
                                    id: id++,
                                    ward,
                                    heightCategory: cat,
                                    male: counts.Male,
                                    female: counts.Female
                                });
                            });
                        });

                        setTableRows(rows);
                        setTableCols([
                            { field: 'ward', headerName: 'Ward Name', flex: 1 },
                            { field: 'heightCategory', headerName: 'Height Category', flex: 1 },
                            { field: 'male', headerName: 'Male', flex: 1 },
                            { field: 'female', headerName: 'Female', flex: 1 }
                        ]);
                    }
                });
            }
        });
    }, [setTableRows, setTableCols]);

    const datasets = categoryOrder.map(category => ({
        label: category,
        data: wardLabels.map(ward => {
            const male = heightData[ward]?.[category]?.Male || 0;
            const female = heightData[ward]?.[category]?.Female || 0;
            return male + female;
        }),
        borderColor: baseColors[category],
        backgroundColor: baseColors[category],
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
                        const male = heightData[ward]?.[category]?.Male || 0;
                        const female = heightData[ward]?.[category]?.Female || 0;
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
                    font: { weight: 'bold' }
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
                Height Category Distribution by Ward (Chittagong City Corporation)
            </Typography>
            <Box className="h-[95%] w-full overflow-hidden flex justify-center">
                <Line data={chartData} options={options} />
            </Box>
        </Box>
    );
}
