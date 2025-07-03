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

export default function BMICategoryLineGraphChittagong({ setTableRows, setTableCols }) {
    const [bmiData, setBmiData] = useState({});
    const [bmiCategories, setBmiCategories] = useState([]);

    const colorMap = {
        'Underweight': '#e53935',                  // Deep Red
        'Healthy Weight': '#1e88e5',              // Deep Blue
        'Overweight': '#43a047',                  // Deep Green
        'Obesity Class 1': '#ffa000',             // Amber
        'Class 2 Obesity': '#fb8c00',             // Deep Orange
        'Class 3 Obesity (Severe Obesity)': '#6d4c41', // Dark Brown
        'Others': '#757575'                       // Medium Gray
    };

    useEffect(() => {
        Papa.parse('/finalData_01.csv', {
            download: true,
            header: true,
            complete: (result) => {
                const data = result.data.filter(
                    row => row.ADM2_EN === 'Chittagong' && row.CityCorporation_Area !== 'Y'
                );

                const categorized = {};
                const categorySet = new Set();

                data.forEach(row => {
                    const subdistrict = row.ADM3_EN;
                    const category = row['BMI Category'];
                    const sex = row['Sex'];

                    if (!subdistrict || !category || !sex) return;
                    categorySet.add(category);

                    if (!categorized[subdistrict]) categorized[subdistrict] = {};
                    if (!categorized[subdistrict][category]) {
                        categorized[subdistrict][category] = { Male: 0, Female: 0 };
                    }

                    if (sex === 'M') categorized[subdistrict][category].Male++;
                    else if (sex === 'F') categorized[subdistrict][category].Female++;
                });

                setBmiData(categorized);
                setBmiCategories(Array.from(categorySet));

                const rows = [];
                let id = 1;
                Object.entries(categorized).forEach(([subdistrict, cats]) => {
                    Object.entries(cats).forEach(([category, counts]) => {
                        rows.push({
                            id: id++,
                            subdistrict,
                            bmiCategory: category,
                            male: counts.Male,
                            female: counts.Female
                        });
                    });
                });

                setTableRows(rows);
                setTableCols([
                    { field: 'subdistrict', headerName: 'Subdistrict', flex: 1 },
                    { field: 'bmiCategory', headerName: 'BMI Category', flex: 1 },
                    { field: 'male', headerName: 'Male', flex: 1 },
                    { field: 'female', headerName: 'Female', flex: 1 }
                ]);
            }
        });
    }, [setTableRows, setTableCols]);

    const labels = Object.keys(bmiData);

    const datasets = bmiCategories.map(category => ({
        label: category,
        data: labels.map(sub => {
            const male = bmiData[sub]?.[category]?.Male || 0;
            const female = bmiData[sub]?.[category]?.Female || 0;
            return male + female;
        }),
        borderColor: colorMap[category] || '#333',
        backgroundColor: colorMap[category] || '#333',
        tension: 0.2,
        fill: false,
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

                        const male = bmiData[subdistrict]?.[category]?.Male || 0;
                        const female = bmiData[subdistrict]?.[category]?.Female || 0;
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
                BMI Category Distribution by Subdistrict (Chittagong)
            </Typography>
            <Box className="h-[95%] w-full overflow-hidden flex justify-center">
                <Line data={chartData} options={options} />
            </Box>
        </Box>
    );
}
