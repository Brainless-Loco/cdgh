const fs = require('fs');
const Papa = require('papaparse');

// File paths
const mainDataFile = 'mainData.csv';
const adm3DataFile = 'adm3Data.csv';
const outputFile = 'finalData.csv';

// Read and parse CSV files
const readCSV = (filePath) => {
  const csvData = fs.readFileSync(filePath, 'utf8');
  return Papa.parse(csvData, { header: true }).data;
};

// Write CSV file
const writeCSV = (filePath, data) => {
  const csv = Papa.unparse(data);
  fs.writeFileSync(filePath, csv, 'utf8');
  console.log(`File saved as ${filePath}`);
};

// Merge data based on address
const mergeCSVData = () => {
  // Parse both CSV files
  const mainData = readCSV(mainDataFile);
  const adm3Data = readCSV(adm3DataFile);

  // Create a map for adm3Data for faster lookup by address
  const adm3Map = adm3Data.reduce((acc, row) => {
    acc[row.Address] = {
      ADM3_EN: row.ADM3_EN || '',
      ADM2_EN: row.ADM2_EN || '',
      ADM1_EN: row.ADM1_EN || '',
    };
    return acc;
  }, {});

  // Add columns to mainData
  const mergedData = mainData.map((row) => {
    const addressData = adm3Map[row.Address] || {
      ADM3_EN: '',
      ADM2_EN: '',
      ADM1_EN: '',
    };

    return {
      ...row,
      ADM3_EN: addressData.ADM3_EN,
      ADM2_EN: addressData.ADM2_EN,
      ADM1_EN: addressData.ADM1_EN,
    };
  });

  // Write the merged data to a new CSV file
  writeCSV(outputFile, mergedData);
};

// Run the merge script
mergeCSVData();
