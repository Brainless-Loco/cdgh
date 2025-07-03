import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function HeightCategoryByDivisionPieCharts({ setTableRows, setTableCols }) {
    const [divisionData, setDivisionData] = useState({});
    const [heightCategories, setHeightCategories] = useState([]);

    const categoryOrder = [
        'Very Short',
        'Short',
        'Below Average',
        'Average',
        'Above Average',
        'Tall',
        'Very Tall',
        'Others'
    ];

    const baseColors = [
        '#e53935', // red
        '#fb8c00', // orange
        '#fdd835', // yellow
        '#43a047', // green
        '#1e88e5', // blue
        '#8e24aa', // purple
        '#6d4c41', // brown
        '#757575'  // gray for Others
    ];

    useEffect(() => {
        Papa.parse('/finalData_01.csv', {
            download: true,
            header: true,
            complete: (result) => {
                const data = result.data;

                // Structure: divisionData[division][category] = { Male: count, Female: count }
                const categorized = {};
                const categorySet = new Set();

                data.forEach(row => {
                    const division = row.ADM1_EN;
                    const height = parseFloat(row['HEIGHT(CM)']);
                    const sex = row['Sex'];
                    if (!division || isNaN(height) || !sex || division === 'Unknown') return;

                    let category = 'Others';
                    if (height < 140) category = 'Very Short';
                    else if (height < 150) category = 'Short';
                    else if (height < 160) category = 'Below Average';
                    else if (height < 170) category = 'Average';
                    else if (height < 180) category = 'Above Average';
                    else if (height < 190) category = 'Tall';
                    else category = 'Very Tall';

                    categorySet.add(category);

                    if (!categorized[division]) categorized[division] = {};
                    if (!categorized[division][category]) categorized[division][category] = { Male: 0, Female: 0 };

                    if (sex === 'M') categorized[division][category].Male++;
                    else if (sex === 'F') categorized[division][category].Female++;
                });

                setDivisionData(categorized);
                setHeightCategories(Array.from(categorySet).sort((a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)));

                // Prepare table rows with male/female counts
                const rows = [];
                let id = 1;
                Object.entries(categorized).forEach(([division, cats]) => {
                    Object.entries(cats).forEach(([category, counts]) => {
                        rows.push({
                            id: id++,
                            division,
                            heightCategory: category,
                            male: counts.Male,
                            female: counts.Female,
                            total: counts.Male + counts.Female,
                        });
                    });
                });

                setTableRows(rows);
                setTableCols([
                    { field: 'division', headerName: 'Division', flex: 1 },
                    { field: 'heightCategory', headerName: 'Height Category', flex: 1 },
                    { field: 'male', headerName: 'Male', flex: 1 },
                    { field: 'female', headerName: 'Female', flex: 1 },
                    { field: 'total', headerName: 'Total', flex: 1 },
                ]);
            }
        });
        // eslint-disable-next-line
    }, [setTableRows, setTableCols]);

    const renderPieCharts = () => {
        const colorMap = {};
        heightCategories.forEach((cat, index) => {
            colorMap[cat] = baseColors[index % baseColors.length];
        });

        return Object.entries(divisionData).map(([division, counts]) => {
            const labels = heightCategories;
            const dataValues = labels.map(label => {
                const catCounts = counts[label] || { Male: 0, Female: 0 };
                return catCounts.Male + catCounts.Female;
            });
            const backgroundColors = labels.map(label => colorMap[label]);

            const data = {
                labels,
                datasets: [{
                    data: dataValues,
                    backgroundColor: backgroundColors,
                    borderWidth: 1,
                }],
            };

            const options = {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const category = context.label || '';
                                const divisionName = division; // from closure
                                const catCounts = divisionData[divisionName]?.[category] || { Male: 0, Female: 0 };
                                const male = catCounts.Male;
                                const female = catCounts.Female;
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
                            font: {
                                weight: 'bold'
                            }
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
        <Box className='w-full overflow-auto h-full py-1'>
            <Box className="w-full flex justify-center flex-row flex-wrap">
                {renderPieCharts()}
            </Box>
        </Box>
    );
}
