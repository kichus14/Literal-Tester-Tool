import React, { useState, useEffect } from 'react';
import axios from 'axios';
import readXlsxFile from 'read-excel-file';



import { baseUrl, rawFile, xlsxSchema } from '../Constant';
import { xmlToJson, csvToJSON, JSONToCSVConvertor, xmlParser } from '../shared/utils';

function LegacyLiterals() {
 

    const [languageList, setLanguageList] = useState(['all', 'en', 'nl', 'fr', 'de']);
    const [selectedFile, setSelectedFile] = React.useState("");
    const [spreedSheetData, setSpreedSheetData] = React.useState([]);
    const [xmlData, setXMLData] = React.useState([]);
    const [loading, setLoading] = useState(false);
    const [isLITCode, setIsLITCode] = useState(false);
    const [literalKey, setLiteralKey] = useState("LIT-KD");   // possible option LIT-KD or TXT-CD
    const [disableStartTest, setDisableStartTest] = useState(true);

    // useEffect(() => {
    //     setLoading(false);
    // }, []);

    useEffect(() => {
        setLoading(false);
        console.log(spreedSheetData);
        console.log(xmlData);
        if(spreedSheetData.length && xmlData.length) {
            setDisableStartTest(false);
        }
    }, [spreedSheetData, xmlData]);

    useEffect(() => {
        if(isLITCode) {
            setLiteralKey("LIT-KD");
        } else {
            setLiteralKey("TXT-CD");
        }
    }, [isLITCode]);

    function generateReport() {
        let result = [...spreedSheetData];
        result.forEach(spreedSheetRowData => {
            const id = spreedSheetRowData[literalKey];
            let XMLRowVal = null;
            if(id) {
                XMLRowVal = xmlData.filter(item => item['@attributes'].id == spreedSheetRowData[literalKey])[0];
            }

            if(XMLRowVal) {
                spreedSheetRowData.de = typeof XMLRowVal.value[0] == "string" ? XMLRowVal.value[0].replace(/,/g,'') : XMLRowVal.value[0];
                spreedSheetRowData.en = typeof XMLRowVal.value[1] == "string" ? XMLRowVal.value[1].replace(/,/g,'') : XMLRowVal.value[1];
                spreedSheetRowData.fr = typeof XMLRowVal.value[2] == "string" ? XMLRowVal.value[2].replace(/,/g,'') : XMLRowVal.value[2];
                spreedSheetRowData.nl = typeof XMLRowVal.value[3] == "string" ? XMLRowVal.value[3].replace(/,/g,'') : XMLRowVal.value[3];
                //spreedSheetRowData.pl = typeof XMLRowVal.value[4] == "string" ? XMLRowVal.value[4].replace(/,/g,'') : XMLRowVal.value[4];
            }
            spreedSheetRowData = cleanObject(spreedSheetRowData);
        });
        setSpreedSheetData(result);
    }

    function downloadReport () {
        JSONToCSVConvertor(spreedSheetData, "legecy-literals", true);
    }

    
    // Handles file upload event and updates state
    // function handleUpload(event) {
    //     let file = event.target.files[0];
    //     if(file.name.includes(".xlsx")) {
    //         readXlsxFile(event.target.files[0], {schema:xlsxSchema}).then((excelData) => {
    //             setSpreedSheetData(excelData.rows);
    //         });
    //         setSelectedFile(event.target.files[0]);
    //     } else if (file.name.includes(".csv")) {
    //         let reader = new FileReader();
    //         reader.onload = function (e) {
    //             let json = JSON.parse(csvToJSON(e.target.result));
    //             setSpreedSheetData(json);
    //         };
    //         reader.readAsBinaryString(file);
    //         setSelectedFile(event.target.files[0]);
    //     } else {
    //         setSelectedFile({ name: "un-supported format"});
    //     }
    // }

    // Handles file upload event and updates state
    function handleUpload(event) {
        setLoading(true);
        let file = event.target.files[0];
        if (file.name.includes(".csv")) {
            let reader = new FileReader();
            reader.onload = function (e) {
                let json = JSON.parse(csvToJSON(e.target.result));
                setSpreedSheetData(json);
            };
            reader.readAsBinaryString(file);
            setSelectedFile(event.target.files[0]);
        } else {
            setSelectedFile({ name: "un-supported format"});
        }
    }


    
    function uploadXML(event) {
        setLoading(true);
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.onload = function (e) {
            const xmlDOM = new DOMParser().parseFromString(e.target.result, 'text/xml');
            //const xmlDOM = xmlParser(e.target.result);
            const resultParsed = xmlToJson(xmlDOM);
            console.log(resultParsed.codemanager.codes.code);
            setXMLData(resultParsed.codemanager.codes.code);
        };
        reader.readAsText(file);
    }

    function cleanObject(obj) {
        for (var propName in obj) {
          if (obj[propName] === null || obj[propName] === undefined) {
            delete obj[propName];
          }
        }
        return obj
      }

    return (
        <div className="row nopadding">
            <div className="col-md-12 nopadding">
                <div className="row padding-15">
                    <div className="col-md-12">
                        <h2>Legacy App literals extrctor</h2>
                        
                        <h4>Upload LIT & TXT ids</h4>
                        <div>
                            <input type="file" onChange={handleUpload} />
                            <p>Filename: {selectedFile.name}</p>
                            <p>File type: {selectedFile.type}</p>
                        </div>

                        <h4>Upload LIT or TXT XML file to compare</h4>
                        <div>
                            <input type="file" onChange={uploadXML} />
                            <p>Filename: {selectedFile.name}</p>
                            <p>File type: {selectedFile.type}</p>
                        </div>
                        <label class="form-switch floatleft">Is LIT Code <input type="checkbox" onChange={e => setIsLITCode(e.target.checked)}/><i></i></label>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="row padding-15">
                        <button type="button"  disabled={disableStartTest} className="btn btn-dark text-center compare-btn" onClick={e => generateReport()}>Generate Report</button>
                    </div>
                    <div className="row padding-15">
                        <button type="button"  disabled={disableStartTest} className="btn btn-dark text-center compare-btn" onClick={e => downloadReport()} >Download</button>
                    </div>
                </div>
                
                <div className="h-100 row align-items-center mrg-200 loading-bar" style={{ display: loading ? 'block' : 'none' }}>
                    <div className="col-sm-12 offset-6  mrg-200 ">
                        <div className="spinner-border my-auto" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LegacyLiterals;
