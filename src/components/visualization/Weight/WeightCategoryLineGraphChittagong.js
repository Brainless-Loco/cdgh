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

export default function WeightCategoryLineGraphChittagong({ setTableRows, setTableCols }) {
    const [weightData, setWeightData] = useState({});

    const categoryOrder = [
        'Very Low Weight',
        'Low Weight',
        'Medium Weight',
        'High Weight',
        'Very High Weight',
        'Extremely High Weight',
        'Others'
    ];

    const baseColors = {
        'Very Low Weight': '#d32f2f',        // red
        'Low Weight': '#f57c00',             // orange
        'Medium Weight': '#fbc02d',          // yellow
        'High Weight': '#388e3c',            // green
        'Very High Weight': '#1976d2',       // blue
        'Extremely High Weight': '#7b1fa2', // purple
        'Others': '#455a64'                  // dark gray
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
                    const weight = parseFloat(row['WEIGHT (KG)']);
                    const sex = row['Sex'];
                    if (!subdistrict || !sex) return;

                    let category = 'Others';
                    if (!isNaN(weight)) {
                        if (weight < 50) category = 'Very Low Weight';
                        else if (weight < 60) category = 'Low Weight';
                        else if (weight < 70) category = 'Medium Weight';
                        else if (weight < 80) category = 'High Weight';
                        else if (weight < 90) category = 'Very High Weight';
                        else category = 'Extremely High Weight';
                    }

                    if (!categorized[subdistrict]) categorized[subdistrict] = {};
                    if (!categorized[subdistrict][category]) {
                        categorized[subdistrict][category] = { Male: 0, Female: 0 };
                    }

                    if (sex === 'M') categorized[subdistrict][category].Male++;
                    else if (sex === 'F') categorized[subdistrict][category].Female++;
                });

                setWeightData(categorized);

                const rows = [];
                let id = 1;
                Object.entries(categorized).forEach(([subdistrict, cats]) => {
                    Object.entries(cats).forEach(([category, counts]) => {
                        rows.push({
                            id: id++,
                            subdistrict,
                            weightCategory: category,
                            male: counts.Male,
                            female: counts.Female
                        });
                    });
                });

                setTableRows(rows);
                setTableCols([
                    { field: 'subdistrict', headerName: 'Subdistrict', flex: 1 },
                    { field: 'weightCategory', headerName: 'Weight Category', flex: 1 },
                    { field: 'male', headerName: 'Male', flex: 1 },
                    { field: 'female', headerName: 'Female', flex: 1 }
                ]);
            }
        });
    }, [setTableRows, setTableCols]);

    const labels = Object.keys(weightData);

    const datasets = categoryOrder.map(category => ({
        label: category,
        data: labels.map(sub => {
            const male = weightData[sub]?.[category]?.Male || 0;
            const female = weightData[sub]?.[category]?.Female || 0;
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
                        const subdistrict = chartData.labels[context.dataIndex];

                        const male = weightData[subdistrict]?.[category]?.Male || 0;
                        const female = weightData[subdistrict]?.[category]?.Female || 0;
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
                Weight Category Distribution by Subdistrict (Chittagong)
            </Typography>
            <Box className="h-[95%] w-full overflow-hidden flex justify-center">
                <Line data={chartData} options={options} />
            </Box>
        </Box>
    );
}
