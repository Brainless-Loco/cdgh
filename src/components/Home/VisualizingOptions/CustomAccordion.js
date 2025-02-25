import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from "@mui/material/AccordionDetails";
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CustomAccordion = ({ option, handleSelectionChange, renderOptions }) => {
    return (
        <Accordion
            key={option.category}
            defaultExpanded={true} // Accordion starts expanded
            className="my-3 rounded-lg shadow-md w-[95%] "
            sx={{backgroundColor:'#0a1b4a',marginX:'auto'}}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{color:'white'}}/>}>
                {option.icon && option.icon}
                <Typography variant="h6" className="font-semibold text-cyan-100">{option.category}</Typography>
            </AccordionSummary>
            <AccordionDetails className="h-auto">
                <FormControl >
                    <RadioGroup
                        name={option.category}
                        onChange={(e) => handleSelectionChange(e.target.value)}
                    >
                        {renderOptions(option.levels)}
                    </RadioGroup>
                </FormControl>
            </AccordionDetails>
        </Accordion>
    );
};

export default CustomAccordion;
