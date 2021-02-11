import React, { useState, useEffect } from 'react';
import axios from 'axios';
import readXlsxFile from 'read-excel-file';



import { baseUrl, rawFile, xlsxSchema } from '../Constant';
import { xmlToJson, csvToJSON, JSONToCSVConvertor } from '../shared/utils';

function LiteralTester() {
    const [projectList, setProjectListState] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    
    const [viewToggle, setViewToggle] = useState(false);

    const [repositoriesList, setRepositoriesList] = useState([]);
    const [selectedRepo, setSelectedRepo] = useState(null);

    const [branchList, setBranchList] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);

    

    const [repoRootPath, setRepoRootPath] = useState('application');


    const [languageList, setLanguageList] = useState(['all', 'en', 'nl', 'fr', 'de']);
    const [selectedLang, setSelectedLang] = useState([]);

    const [selectedXML, setSelectedXML] = useState({en:{}, nl:{}, fr:{}, de:{}});


    const [disableStartTest, setDisableStartTest] = useState(true);


    const [selectedFile, setSelectedFile] = React.useState("");

    const [spreedSheetData, setSpreedSheetData] = React.useState([]);

    const [testResultPass, setTestResultPass] = useState(false);
    const [resultData, setResultData] = useState([]);

    const [resultOverview, setResultOverview] = useState([]);

    const [passCount, setPassCount] = useState(null);
    const [failCount, setFailCount] = useState(null);
    const [missingCount, setMissingCount] = useState(null);
    const [missingIDCount, setMissingIDCount] = useState(null);
    const tableConfig = ["#", "Transaction", "Screen ID","Literal ID", "Literal"];
    const [tableHeader, setTableHeader] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getProjectList();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            getRepoList();
        }
    }, [selectedProject]);

    useEffect(() => {
        if (selectedRepo) {
            getBranchList();
        }
    }, [selectedRepo]);

    useEffect(() => {
        if (selectedBranch) {
            //getBranchList();
        }
    }, [selectedBranch]);

    useEffect(() => {
        if ((selectedXML.en|| selectedXML.nl || selectedXML.fr || selectedXML.de) && spreedSheetData && spreedSheetData.length) {
            setDisableStartTest(false);
        }
    }, [selectedXML.en, selectedXML.nl, selectedXML.fr, selectedXML.de, spreedSheetData]);

    useEffect(() => {
        if (selectedLang) {
            getRawFile();
        }
    }, [selectedLang]);

    function getProjectList () {
        axios.get(baseUrl + '/projects')
        .then(res => {
            setProjectListState(res.data.values);
            setLoading(false);
        })
        .catch(err => console.log(err));
    }

    function getRawFile() {
        //const postData = { key: selectedProject.key, repokey: selectedRepo.key, branchPath: selectedBranch.key, lang: selectedLang.key };
        setLoading(true);
        let request = [];
        selectedLang.forEach(function(lang){
            request.push(axios.post(baseUrl + '/readliterals', { key: selectedProject.key, repokey: selectedRepo.key, branchPath: selectedBranch.key, lang: lang.key, rootPath: repoRootPath }));
        });

        axios.all(request)
          .then(responseAllLangXML => {
            responseAllLangXML.forEach(function(langXML){
                const xmlDOM = new DOMParser().parseFromString(langXML.data, 'text/xml');
                const langConfig = JSON.parse(langXML.config.data);
                console.log(xmlDOM);
                const resultParsed = xmlToJson(xmlDOM);
                switch(langConfig.lang) {
                    case 'en':
                        selectedXML.en = resultParsed.xliff.file.body['trans-unit'];
                    break;
                    case 'nl':
                        selectedXML.nl = resultParsed.xliff.file.body['trans-unit'];
                    break;
                    case 'fr':
                        selectedXML.fr = resultParsed.xliff.file.body['trans-unit'];
                    break;
                    case 'de':
                        selectedXML.de = resultParsed.xliff.file.body['trans-unit'];
                    break;
                    default:
                    break;
                }
            });
            setSelectedXML(selectedXML);
            setLoading(false);
          });
    }

    function getBranchList() {
        const postData = { key: selectedProject.key, repokey: selectedRepo.key };
        setLoading(true);
        axios.post(baseUrl + '/branches', postData)
            .then(res => {
                setLoading(false);
                setBranchList(res.data.values);
            })
            .catch(err => console.log(err))
    }

    function getRepoList() {
        const postData = { key: selectedProject.key };
        setLoading(true);
        axios.post(baseUrl + '/repositoriesLists', postData)
            .then(res => {
                setRepositoriesList(res.data.values);
                setLoading(false);
            })
            .catch(err => console.log(err))
    }

    // Handles file upload event and updates state
    function handleUpload(event) {
        let file = event.target.files[0];
        if(file.name.includes(".xlsx")) {
            readXlsxFile(event.target.files[0], {schema:xlsxSchema}).then((excelData) => {
                setSpreedSheetData(excelData.rows);
            });
            setSelectedFile(event.target.files[0]);
        } else if (file.name.includes(".csv")) {
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

    function resetSelection() {
        //setProjectListState([]);
        setSelectedProject(null);

        setRepositoriesList([]);
        setSelectedRepo(null);

        setBranchList([]);
        setSelectedBranch(null);

        setSelectedLang([]);

        setSelectedXML({en:{}, nl:{}, fr:{}, de:{}});

        setDisableStartTest(true);

        setSelectedFile('');

        setSpreedSheetData([]);

        //setTestResultPass(false);

        //setResultData([]);

    }

    function downloadXMLResults () {
        let consolidatedXML = [];
        selectedLang.forEach(function (language) {
            selectedXML[language.key].map(function (item) {
                let targetData;
                if(typeof (item.target) == 'string') {
                    targetData = item.target.trim();
                } else if (typeof (item.target["#text"]) == 'string') {
                    targetData = item.target["#text"].trim();
                } else {
                    targetData = (item.target["#text"]) ? item.target["#text"].join("<INTERPOLATION>").replace(/  +/g, ' ').trim() : "";
                }

                let currentRow = consolidatedXML && consolidatedXML.find(function (rowData) {
                    return rowData.id === item['@attributes'].id;
                })
                if(currentRow) {
                    currentRow[language.key] = targetData;
                } else {
                    currentRow = {"id": item['@attributes'].id, ["" + language.key + ""]: targetData};
                }
                consolidatedXML.push(currentRow);
                return currentRow;
            });
          })
          if(consolidatedXML && consolidatedXML.length) {
            JSONToCSVConvertor(consolidatedXML , selectedProject.name, true);
          } else {
            alert("XML not found")
          }
    }

    function exportResults () {
        JSONToCSVConvertor(resultData, null, true);
    }

    function execturTest() {
        let finalData = [];
        let tableColumn = tableConfig;
        //for (const [key, value] of Object.entries(selectedXML)) {

        selectedLang.forEach(function (language) {    
            finalData = testRunner(selectedXML[language.key], language.key);
            tableColumn.push(language.key+'-status');
        });
        //}
        debugger;
          setTableHeader(tableColumn);
          setResultData(finalData);
    }

    function cleanObject(obj) {
        for (var propName in obj) {
          if (obj[propName] === null || obj[propName] === undefined) {
            delete obj[propName];
          }
        }
        return obj
      }

    function testRunner(curentLangXML, lang) {
        let result = [], passItem = 0, failItem = 0;
        let allPass = true;
        //debugger;
        console.log(curentLangXML);
        spreedSheetData.forEach(spreedSheetRowData => {
            //const XMLRowVal = curentLangXML.filter(item => item['@attributes'].id == spreedSheetRowData.id)[0];
            const XMLRowVal = curentLangXML.filter(function(item) { 
                // if((spreedSheetRowData.id == item['@attributes'].id)) {
                //     debugger;
                //     if(lang == "fr"){
                //         debugger;
                //     }
                // }
                //console.log(item);
                //console.log(item['@attributes'].id, lang);
                return item['@attributes'].id == spreedSheetRowData.id;
            })[0];

            let excelText = typeof spreedSheetRowData[lang] == 'string' ? spreedSheetRowData[lang].trim() : spreedSheetRowData[lang];
            let xmlText = "";
            if (XMLRowVal && XMLRowVal.target) {
                if(typeof (XMLRowVal.target) == 'string') {
                    xmlText = XMLRowVal.target.trim();
                } else if (typeof (XMLRowVal.target["#text"]) == 'string') {
                    xmlText = XMLRowVal.target["#text"].trim();
                } else {
                    xmlText = XMLRowVal.target["#text"].join("").trim();
                }
            }
            if (XMLRowVal && spreedSheetRowData.id == XMLRowVal['@attributes'].id) {
                if (excelText === xmlText) {
                    xmlText = xmlText.replace(/"/g, '');
                    excelText = excelText.replace(/"/g, '');
                    spreedSheetRowData[`${lang}`] = excelText;
                    spreedSheetRowData[`${lang}-expected-result`] = xmlText;
                    spreedSheetRowData[`${lang}-status`] = "Pass";
                    passItem++;
                } else {
                    xmlText = (typeof(xmlText) == "string") ? xmlText.replace(/"/g, '') : xmlText;
                    excelText = (typeof(excelText) == "string") ? excelText.replace(/"/g, '') : excelText;
                    spreedSheetRowData[`${lang}`] = excelText;
                    spreedSheetRowData[`${lang}-expected-result`] = xmlText;
                    spreedSheetRowData[`${lang}-status`] = "Fail";
                    allPass = false;
                    failItem++;
                }
                //  if(spreedSheetRowData.id == 'g60-smallInsuranceProducts-productInfo-calculate-your-premium') {
                //     debugger;
                //  }
                //spreedSheetRowData = cleanObject(spreedSheetRowData);
                //result.push(spreedSheetRowData);
            } else {
                //debugger;
                spreedSheetRowData[`${lang}-expected-result`] = xmlText;
                spreedSheetRowData[`${lang}-status`] = "Fail";
            }
            result.push(spreedSheetRowData);
            
        });
        //resultOverview.push({lang, passCount: passItem, failCount: failItem});
        return result;
    } 

    function updateSelectedLang (e) {
        const val = e.target.value.toLowerCase();
        let selLang = [];
        if(val == 'all') {
            languageList.forEach(data => {
                if(data !== 'all') {
                    selLang.push({'key': data, 'name': data });
                }
            });
        } else {
            selLang.push({ 'key': e.target.value, 'name': e.target.options[e.target.selectedIndex].innerText });
        }
        setSelectedLang(selLang);
    }

    return (
        <div className="row nopadding">
            <div className="col-md-12 nopadding">
                <div className="row padding-15">
                    <div className="col-md-12">
                        <label class="form-switch"><input type="checkbox" onChange={e => setViewToggle(e.target.checked)}/><i></i>Toggle View</label>
                    </div>
                </div>
                <div className="row padding-15">
                    <div className={ viewToggle ? "col-md-12" : "col-md-6"}>
                        <div class="form-group">
                            <h4>Select Project</h4>
                            <select class="form-control" name="selectProject" onChange={e => setSelectedProject({ 'key': e.target.value, 'name': e.target.options[e.target.selectedIndex].innerText })}>
                                <option>Select Project</option>
                                {projectList ? projectList.map(data =>
                                    <option key={data.key} value={data.key}>{data.name}</option>
                                ) : null}
                            </select>
                        </div>
                        {repositoriesList && repositoriesList.length
                            ? <div class="form-group">
                                <select class="form-control" name="selectRepository" onChange={e => setSelectedRepo({ 'key': e.target.value, 'name': e.target.options[e.target.selectedIndex].innerText })}>
                                    <option>Select Repository</option>
                                    {repositoriesList.map(data =>
                                        <option key={data.key} value={data.slug}>{data.name}</option>
                                    )}
                                </select>
                                <div class="p-tb-10"><label>App root folder:</label><input type="text" class="rootpath" value={repoRootPath} onChange={e => setRepoRootPath(e.target.value)}/><span class="small-text">(possible options: application, demo)</span></div>
                                </div>
                            : null}

                        {branchList && branchList.length
                            ? <div class="form-group">
                                <select class="form-control" name="selectBranch" onChange={e => setSelectedBranch({ 'key': e.target.value, 'name': e.target.options[e.target.selectedIndex].innerText })}>
                                    <option>Select Branch</option>
                                    {branchList.map(data =>
                                        <option key={data.id} value={data.id}>{data.displayId}</option>
                                    )};
                            </select></div>
                            : null}

                        {selectedBranch
                            ? <div class="form-group">
                                <select class="form-control" name="selectLangage" onChange={e => updateSelectedLang(e)}>
                                    <option>Select language to run literal test</option>
                                    {languageList.map(lang =>
                                        <option key={lang} value={lang}>{lang}</option>
                                    )}
                                </select></div>
                            : null}
                    </div>
                    {viewToggle ? null : <div className="col-md-6">
                        
                        <h4>Upload literal sheet to be compared</h4>
                        <div>
                            <input type="file" onChange={handleUpload} />
                            <p>Filename: {selectedFile.name}</p>
                            <p>File type: {selectedFile.type}</p>
                            <p>File size: {selectedFile.size} bytes</p>
                        </div>
                    </div>}
                </div>
                <div className="col-md-12">
                    <div className="row padding-15">
                        {viewToggle ? <button class="btn btn-dark text-center compare-btn" onClick={e => downloadXMLResults()} >Export XML data</button> 
                        :<button type="button" disabled={disableStartTest} onClick={e => execturTest()} class="btn btn-dark text-center compare-btn">Run Test</button>}
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="row padding-15">
                        {resultData && resultData.length ?
                            <div class="w-100">{testResultPass ? <div class="alert alert-success w-100" role="alert">
                                All TestCase Passed
                        </div> : <div class="alert alert-danger w-100" role="alert">
                                        Below are the list of failed testcases
                        </div>}</div>
                                : null}
                        
                        {resultData && resultData.length ? <div class="result-header">
                                <div className="col-md-12">
                                    <span class="p-3">Total number of test cases: {spreedSheetData.length}</span>
                                    <span class="p-3">Pass: {passCount}</span>
                                    <span class="p-3">Fail: {failCount}</span>
                                    <span class="p-3">Missing: {missingCount}</span>
                                    <span class="p-3">ID not found: {missingIDCount}</span>
                                    <button class="m-3" onClick={e => exportResults()} >Export to excel</button>
                                </div>
                            </div> 
                        : null}
                            
                        {resultData && resultData.length ? <table class="table">
                            <thead class="thead-dark">
                                <tr>
                                    {tableHeader.map(headerItem => <th scope="col">{headerItem}</th>)}
                                </tr>
                            </thead>
                            {resultData.map(resultRow =>
                                <tbody>
                                    <tr>
                                        <th scope="row">#{}</th>
                                        <td>{resultRow.transaction}</td>
                                        <td>{resultRow.screenID}</td>
                                        <td>{resultRow.id}</td>
                                        <td>{resultRow[selectedLang]}</td>
                                        <td><p className={(resultRow['en-status'] == "Pass") ? "text-success" : "text-danger"}>{resultRow['en-status']}</p></td>
                                        <td><p className={(resultRow['nl-status'] == "Pass") ? "text-success" : "text-danger"}>{resultRow['nl-status']}</p></td>
                                        <td><p className={(resultRow['de-status'] == "Pass") ? "text-success" : "text-danger"}>{resultRow['de-status']}</p></td>
                                        <td><p className={(resultRow['fr-status'] == "Pass") ? "text-success" : "text-danger"}>{resultRow['fr-status']}</p></td>
                                    </tr>
                                </tbody>)}
                        </table> : null}
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

export default LiteralTester;
