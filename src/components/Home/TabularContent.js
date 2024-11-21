import React from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';

export default function TabularContent({tableRows, tableCols}) {
  return (
    <Box className="h-full w-full">
        <Typography variant="h5" className="mb-4">
            Tabular Data
        </Typography>
        <Box  className={"flex flex-col"}>
            <DataGrid
                rows={tableRows}
                columns={tableCols}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
            />
        </Box>
        
    </Box>
  )
}
