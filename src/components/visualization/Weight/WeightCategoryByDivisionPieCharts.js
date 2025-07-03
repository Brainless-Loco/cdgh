import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function WeightCategoryByDivisionPieCharts({ setTableRows, setTableCols }) {
    const [divisionData, setDivisionData] = useState({});
    const [weightCategories, setWeightCategories] = useState([]);

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
        'Very Low Weight': '#d32f2f',       // red
        'Low Weight': '#f57c00',            // orange
        'Medium Weight': '#fbc02d',         // yellow
        'High Weight': '#388e3c',           // green
        'Very High Weight': '#1976d2',      // blue
        'Extremely High Weight': '#7b1fa2', // purple
        'Others': '#757575'                 // gray
    };

    useEffect(() => {
        Papa.parse('/finalData_01.csv', {
            download: true,
            header: true,
            complete: (result) => {
                const data = result.data;

                const categorized = {};
                const categorySet = new Set();

                data.forEach(row => {
                    const division = row.ADM1_EN;
                    const weight = parseFloat(row['WEIGHT (KG)']);
                    const sex = row['Sex'];

                    if (!division || !sex || division === 'Unknown') return;

                    let category = 'Others';
                    if (!isNaN(weight)) {
                        if (weight < 50) category = 'Very Low Weight';
                        else if (weight < 60) category = 'Low Weight';
                        else if (weight < 70) category = 'Medium Weight';
                        else if (weight < 80) category = 'High Weight';
                        else if (weight < 90) category = 'Very High Weight';
                        else category = 'Extremely High Weight';
                    }

                    categorySet.add(category);

                    if (!categorized[division]) categorized[division] = {};
                    if (!categorized[division][category]) {
                        categorized[division][category] = { Male: 0, Female: 0 };
                    }

                    if (sex === 'M') categorized[division][category].Male++;
                    else if (sex === 'F') categorized[division][category].Female++;
                });

                setDivisionData(categorized);
                setWeightCategories(Array.from(categorySet).sort(
                    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
                ));

                const rows = [];
                let id = 1;
                Object.entries(categorized).forEach(([division, cats]) => {
                    Object.entries(cats).forEach(([category, counts]) => {
                        rows.push({
                            id: id++,
                            division,
                            weightCategory: category,
                            male: counts.Male,
                            female: counts.Female
                        });
                    });
                });

                setTableRows(rows);
                setTableCols([
                    { field: 'division', headerName: 'Division', flex: 1 },
                    { field: 'weightCategory', headerName: 'Weight Category', flex: 1 },
                    { field: 'male', headerName: 'Male', flex: 1 },
                    { field: 'female', headerName: 'Female', flex: 1 }
                ]);
            }
        });
        // eslint-disable-next-line
    }, [setTableRows, setTableCols]);

    const renderPieCharts = () => {
        return Object.entries(divisionData).map(([division, counts]) => {
            const labels = weightCategories;
            const backgroundColors = labels.map(label => baseColors[label] || '#333');

            const dataValues = labels.map(label => {
                const cat = counts[label];
                return (cat?.Male || 0) + (cat?.Female || 0);
            });

            const data = {
                labels,
                datasets: [{
                    data: dataValues,
                    backgroundColor: backgroundColors,
                    borderWidth: 1
                }]
            };

            const options = {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const category = context.label;
                                // const value = context.raw;
                                const divisionCounts = divisionData[division][category];
                                const male = divisionCounts?.Male || 0;
                                const female = divisionCounts?.Female || 0;
                                const total = male + female;

                                const malePct = total ? ((male / total) * 100).toFixed(1) : 0;
                                const femalePct = total ? ((female / total) * 100).toFixed(1) : 0;

                                return [
                                    `${category}: ${total} people`,
                                    `├─ Male: ${male} (${malePct}%)`,
                                    `└─ Female: ${female} (${femalePct}%)`
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
                }
            };

            return (
                <Box key={division} className="w-[45%] m-1 mb-8 h-[65vh]">
                    <Typography variant="h6" textAlign="center">{division}</Typography>
                    <Box className="h-[90%] w-full flex justify-center items-center">
                        <Pie data={data} options={options} />
                    </Box>
                </Box>
            );
        });
    };

    return (
        <Box className="w-full overflow-auto h-full py-1">
            <Box className="w-full flex justify-center flex-row flex-wrap">
                {renderPieCharts()}
            </Box>
        </Box>
    );
}
