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

export default function HeightCategoryLineGraphChittagong({ setTableRows, setTableCols }) {
    const [heightData, setHeightData] = useState({});

    const categoryOrder = ['Very Short', 'Short', 'Below Average', 'Average', 'Above Average', 'Tall', 'Very Tall'];

    const baseColors = {
        'Very Short': '#d32f2f',      // red
        'Short': '#f57c00',           // orange
        'Below Average': '#fbc02d',   // yellow
        'Average': '#388e3c',         // green
        'Above Average': '#1976d2',   // blue
        'Tall': '#7b1fa2',            // purple
        'Very Tall': '#455a64'        // dark gray
    };

    useEffect(() => {
        Papa.parse('/finalData_01.csv', {
            download: true,
            header: true,
            complete: (result) => {
                const data = result.data.filter(row =>
                    row.ADM2_EN === 'Chittagong' && row.CityCorporation_Area !== 'Y'
                );

                const categorized = {};

                data.forEach(row => {
                    const subdistrict = row.ADM3_EN;
                    const height = parseFloat(row['HEIGHT(CM)']);
                    const sex = row['Sex'];
                    if (!subdistrict || isNaN(height) || !sex) return;

                    let category = 'Others';
                    if (height < 140) category = 'Very Short';
                    else if (height < 150) category = 'Short';
                    else if (height < 160) category = 'Below Average';
                    else if (height < 170) category = 'Average';
                    else if (height < 180) category = 'Above Average';
                    else if (height < 190) category = 'Tall';
                    else category = 'Very Tall';

                    if (!categorized[subdistrict]) categorized[subdistrict] = {};
                    if (!categorized[subdistrict][category]) {
                        categorized[subdistrict][category] = { Male: 0, Female: 0 };
                    }

                    if (sex === 'M') categorized[subdistrict][category].Male++;
                    else if (sex === 'F') categorized[subdistrict][category].Female++;
                });

                setHeightData(categorized);

                const rows = [];
                let id = 1;
                Object.entries(categorized).forEach(([subdistrict, cats]) => {
                    Object.entries(cats).forEach(([category, counts]) => {
                        rows.push({
                            id: id++,
                            subdistrict,
                            heightCategory: category,
                            male: counts.Male,
                            female: counts.Female
                        });
                    });
                });

                setTableRows(rows);
                setTableCols([
                    { field: 'subdistrict', headerName: 'Subdistrict', flex: 1 },
                    { field: 'heightCategory', headerName: 'Height Category', flex: 1 },
                    { field: 'male', headerName: 'Male', flex: 1 },
                    { field: 'female', headerName: 'Female', flex: 1 }
                ]);
            }
        });
    }, [setTableRows, setTableCols]);

    const labels = Object.keys(heightData);

    const datasets = categoryOrder.map(category => ({
        label: category,
        data: labels.map(sub => {
            const male = heightData[sub]?.[category]?.Male || 0;
            const female = heightData[sub]?.[category]?.Female || 0;
            return male + female;
        }),
        borderColor: baseColors[category],
        backgroundColor: baseColors[category],
        tension: 0.2,
        fill: false
    }));

    const chartData = { labels, datasets };

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const category = context.dataset.label;
                        // eslint-disable-next-line
                        const value = context.raw || 0;
                        const subdistrict = chartData.labels[context.dataIndex];

                        const male = heightData[subdistrict]?.[category]?.Male || 0;
                        const female = heightData[subdistrict]?.[category]?.Female || 0;
                        const totalCategory = male + female;

                        const malePct = totalCategory ? ((male / totalCategory) * 100).toFixed(1) : 0;
                        const femalePct = totalCategory ? ((female / totalCategory) * 100).toFixed(1) : 0;

                        return [
                            `${category}: ${totalCategory} people`,
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
                    text: 'Subdistricts'
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
                Height Category Distribution by Subdistrict (Chittagong)
            </Typography>
            <Box className="h-[95%] w-full overflow-hidden flex justify-center">
                <Line data={chartData} options={options} />
            </Box>
        </Box>
    );
}
