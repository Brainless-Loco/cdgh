import Box  from '@mui/material/Box'
import React from 'react'

export default function MapContent({selectedValue}) {
  return (
    <Box className="h-full w-full flex justify-center">
        {
            <img src={"/static/"+selectedValue+'.jpg'} height="100%" alt={selectedValue}/>
        }
    </Box>
  )
}
