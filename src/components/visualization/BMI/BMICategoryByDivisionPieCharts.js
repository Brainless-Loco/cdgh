import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BMICategoryByDivisionPieCharts({ setTableRows, setTableCols }) {
    const [divisionData, setDivisionData] = useState({});
    const [bmiCategories, setBmiCategories] = useState([]);

    const baseColors = [
        'purple', 'green', 'orange', 'blue', 'red', 'gray', 'brown',
        'pink', 'teal', 'gold', 'navy', 'magenta', 'lime', 'coral'
    ];

    useEffect(() => {
        Papa.parse('/finalData_01.csv', {
            download: true,
            header: true,
            complete: (result) => {
                const data = result.data;

                const categoryMap = {};
                const uniqueCategories = new Set();

                data.forEach(row => {
                    const division = row.ADM1_EN;
                    const category = row['BMI Category'];
                    const sex = row['Sex'];
                    if (!division || !category || !sex || division === 'Unknown') return;

                    uniqueCategories.add(category);

                    if (!categoryMap[division]) categoryMap[division] = {};
                    if (!categoryMap[division][category]) categoryMap[division][category] = { Male: 0, Female: 0 };

                    if (sex === 'M') categoryMap[division][category].Male++;
                    else if (sex === 'F') categoryMap[division][category].Female++;
                });

                setDivisionData(categoryMap);
                setBmiCategories(Array.from(uniqueCategories));

                const rows = [];
                let id = 1;
                Object.entries(categoryMap).forEach(([division, cats]) => {
                    Object.entries(cats).forEach(([cat, countObj]) => {
                        rows.push({
                            id: id++,
                            division,
                            bmiCategory: cat,
                            male: countObj.Male,
                            female: countObj.Female,
                            total: countObj.Male + countObj.Female,
                        });
                    });
                });

                setTableRows(rows);
                setTableCols([
                    { field: 'division', headerName: 'Division', flex: 1 },
                    { field: 'bmiCategory', headerName: 'BMI Category', flex: 1 },
                    { field: 'male', headerName: 'Male', flex: 1 },
                    { field: 'female', headerName: 'Female', flex: 1 },
                    { field: 'total', headerName: 'Total', flex: 1 },
                ]);
            },
        });
    }, [setTableRows, setTableCols]);

    const renderPieCharts = () => {
        const colorMap = {};
        bmiCategories.forEach((cat, index) => {
            colorMap[cat] = baseColors[index % baseColors.length];
        });

        return Object.entries(divisionData).map(([division, counts]) => {
            const labels = bmiCategories;
            const dataValues = labels.map(label => {
                const cat = counts[label] || { Male: 0, Female: 0 };
                return cat.Male + cat.Female;
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
                                const countsForCategory = divisionData[divisionName]?.[category] || { Male: 0, Female: 0 };
                                const male = countsForCategory.Male;
                                const female = countsForCategory.Female;
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
