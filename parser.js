// import File System Module
import fs from "fs"; 

// import xml2js Module
import { parseString } from "xml2js";

//xml data
var xmldata = '<?xml version=”1.0" encoding=”UTF-8"?>' +
'<Student>' +
    '<PersonalInformation>' +
        '<FirstName>Sravan</FirstName>' +
        '<LastName>Kumar</LastName>' +
        '<Gender>Male</Gender>' +
    '</PersonalInformation>' +
    '<PersonalInformation>' +
        '<FirstName>Sudheer</FirstName>' +
        '<LastName>Bandlamudi</LastName>' +
        '<Gender>Male</Gender>' +
    '</PersonalInformation>' +
'</Student>';

// parsing xml data
parseString(xmldata, function (err, results) {

// parsing to json
let data = JSON.stringify(results)

// display the json data
console.log("results",data);
});


var msg = 'Orks,\nOrks,\nOrks!\n';
console.log(msg);
