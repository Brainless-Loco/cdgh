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

const DivisionWiseBarGraph = ({setTableRows, setTableCols}) => {
  const [chartData, setChartData] = useState(null);
  const csvFilePath = './finalData_01.csv';

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(csvFilePath);
      const csvText = await response.text();
  
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
                backgroundColor: '#0303ff',
                borderColor: '#1497a3',
                borderWidth: 1,
              },
            ],
          });
  
          // Prepare data for DataGrid
          const rows = Object.entries(divisionCounts).map(([division, count], index) => ({
            id: index + 1,
            division,
            count,
          }));
  
          setTableRows(rows);
  
          // Dynamic column widths
          setTableCols([
            { field: 'id', headerName: 'ID', flex: 0.5, headerClassName: 'custom-header' },
            { field: 'division', headerName: 'Division', flex: 1, headerClassName: 'custom-header' },
            { field: 'count', headerName: 'Count', flex: 1, headerClassName: 'custom-header' },
          ]);
          
        },
      });
    };
  
    fetchData();
  }, [csvFilePath, setTableRows, setTableCols]);
  

  // Render bar graph
  return (
    <Box className="w-full m-0 h-full overflow-x-auto">
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
