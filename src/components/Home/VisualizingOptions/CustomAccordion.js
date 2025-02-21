import { Accordion, AccordionSummary, AccordionDetails, FormControl, RadioGroup, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CustomAccordion = ({ option, handleSelectionChange, renderOptions }) => {
    return (
        <Accordion
            key={option.category}
            defaultExpanded={true} // Accordion starts expanded
            className="my-3 rounded-lg shadow-md w-[95%]"
            sx={{backgroundColor:'#0c1021',marginX:'auto'}}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{color:'white'}}/>}>
                {option.icon && <option.icon className="mr-2 text-white" />}
                <Typography variant="h6" className="font-semibold text-white">{option.category}</Typography>
            </AccordionSummary>
            <AccordionDetails className="h-auto">
                <FormControl>
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
