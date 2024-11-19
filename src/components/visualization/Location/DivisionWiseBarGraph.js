import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Papa from 'papaparse';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DivisionWiseBarGraph = () => {
  const [chartData, setChartData] = useState(null);
  const csvFilePath = './finalData.csv';

  useEffect(() => {
    // Parse the CSV and process data
    const fetchData = async () => {
      const response = await fetch(csvFilePath);
      const csvText = await response.text();

      // Parse CSV data
      Papa.parse(csvText, {
        header: true,
        complete: (result) => {
          const data = result.data;

          // Count rows for each division
          const divisionCounts = data.reduce((acc, row) => {
            const division = row.ADM1_EN;
            if (division && division !== 'Unknown') {
              acc[division] = (acc[division] || 0) + 1;
            }
            return acc;
          }, {});

          // Prepare data for Chart.js
          setChartData({
            labels: Object.keys(divisionCounts),
            datasets: [
              {
                label: 'Division-wise Count',
                data: Object.values(divisionCounts),
                backgroundColor: 'rgba(3, 192, 252, 0.7)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          });
        },
      });
    };

    fetchData();
  }, [csvFilePath]);

  // Render bar graph
  return (
    <Box style={{ width: '90%', margin: '0 auto', height:'70vh',overflowX:'auto' }}>
      <h2>Division-Wise Count</h2>
      {chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Division',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Count',
                },
                beginAtZero: true,
              },
            },
          }}
        />
      ) : (
        <Typography variant='h5'>Loading...</Typography>
      )}
    </Box>
  );
};

export default DivisionWiseBarGraph;
