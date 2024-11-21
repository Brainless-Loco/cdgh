import React from 'react'
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

export default function TabularContent({tableRows, tableCols}) {
  return (
    <Box className="h-full w-full">
        <Box  className={"flex flex-col h-full"}>
            <DataGrid
                rows={tableRows}
                columns={tableCols}
                pageSize={10}
                // pageSizeOptions={[10, 20, 30]}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
                sx={gridStyles}
            />
        </Box>
        
    </Box>
  )
}

const gridStyles = {
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#3f51b5', // Background color for header
    fontWeight: 'bold',         // Bold text
    color:'blue'
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 'bold',         // Ensures header title is bold
  },
};