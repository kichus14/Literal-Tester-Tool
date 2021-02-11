

export function xmlToJson(xml) {
  // Create the return object
  var obj = {};

  if (xml.nodeType == 1) {
    // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) {
    // text
    obj = unescape(xml.nodeValue);
  }

  // do children
  // If all text nodes inside, get concatenated text from them.
  var textNodes = [].slice.call(xml.childNodes).filter(function (node) {
    return node.nodeType === 3;
  });
  if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
    obj = [].slice.call(xml.childNodes).reduce(function (text, node) {
      return text + node.nodeValue;
    }, "");
  } else if (xml.hasChildNodes()) {
    for (var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof obj[nodeName] == "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof obj[nodeName].push == "undefined") {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}

export function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {     

  //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
  var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
  var CSV = '';    
  //This condition will generate the Label/Header
  if (ShowLabel) {
      var row = "";
  
      //This loop will extract the label from 1st index of on array
      for (var index in arrData[0]) {
          //Now convert each value to string and comma-seprated
          row += index + ',';
      }
      row = row.slice(0, -1);
      //append Label row with line break
      CSV += row + '\r\n';
  }

  //1st loop is to extract each row
  for (var i = 0; i < arrData.length; i++) {
      var row = "";
      
      //2nd loop will extract each column and convert it in string comma-seprated
      for (var index in arrData[i]) {
          row += '"' + arrData[i][index] + '",';
      }
      row.slice(0, row.length - 1);
      //add a line break after each row
      CSV += row + '\r\n';
  }
  if (CSV == '') {        
      alert("Invalid data");
      return;
  }   
  
  //this trick will generate a temp "a" tag
  var link = document.createElement("a");    
  link.id="lnkDwnldLnk";
  
  //this part will append the anchor tag and remove it after automatic click
  document.body.appendChild(link);
  
  var csv = CSV;  
  const blob = new Blob(["\ufeff",csv], { type: 'text/csv;charset=utf-8;' }); 
  var csvUrl = window.webkitURL.createObjectURL(blob);
  var filename = ReportTitle ? ReportTitle + '.csv' : 'Export.csv';
  document.querySelector("#lnkDwnldLnk").setAttribute('download', filename);
  document.querySelector("#lnkDwnldLnk").setAttribute('href', csvUrl);
  
  document.querySelector("#lnkDwnldLnk").click();
  document.body.removeChild(link);
  }

export function csvToJSON(csv) {
  var lines = csv.split("\n");
  var result = [];
  var headers = lines[0].split(",");
  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(",");
    for (var j = 0; j < headers.length; j++) {
      const key = typeof(headers[j]) == 'string' ? headers[j].trim() : headers[j];
      const val = typeof(currentline[j]) == 'string' ? currentline[j].trim() : currentline[j];
      obj[key] = val;
    }
    result.push(obj);
  }
  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
};


// export function csvToJSON(csvText) {
//   let lines = [];
//   const linesArray = csvText.split('\n');
//   // for trimming and deleting extra space 
//   linesArray.forEach((e) => {
//       let row = e.replace(/[\s]+[,]+|[,]+[\s]+/g, ',').trim();
//       row = row.replace(/"/g,'');
//       row = row.replace(/'/g,"");
//       lines.push(row);
//   });
//   // for removing empty record
//   lines.splice(lines.length - 1, 1);
//   const result = [];
//   const headers = lines[0].split(",");
  
//   for (let i = 1; i < lines.length; i++) {
  
//       const obj = {};
//       const currentline = lines[i].split(",");
  
//       for (let j = 0; j < headers.length; j++) {
//       obj[headers[j]] = currentline[j];
//       }
//       result.push(obj);
//   }
//   //return result; //JavaScript object
//    return JSON.stringify(result); //JSON
//   //return result;
//   }