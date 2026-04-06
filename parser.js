// import File System Module
import fs from 'fs';

// import xml2js Module
import { parseString } from "xml2js";

const filePath = './Orks & Tyranids catalog/Orks.cat';

// read the Orks.cat file
fs.readFile(filePath, 'utf8', (err, xmldata) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // parsing xml data
  parseString(xmldata, function (err, results) {
    if (err) {
      console.error('Error parsing XML:', err);
      return;
    }

    // parsing to json
    let data = JSON.stringify(results, null, 2);

    // display the json data
    console.log("results", data);
  });
});
