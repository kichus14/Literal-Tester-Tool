import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {baseUrl, category, subCategory, commonAction, actionItem, angularKBCPractice, mitigationApproach, commentStatus} from '../Constant';
import '../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

function Comments(props) {
    const [commentList, setCommentListState] = useState([]);
    const [loading, setLoading] = useState(false);
    const commentData = [];
    const cellEditProp = {
      mode: 'dbclick',
      blurToSave: true
    };

    const createCustomExportCSVButton = (onClick) => {
      return (
        <button style={ { color: 'red' } } onClick={ onClick }>Custom Export CSV Btn</button>
      );
    }

    const options = {
      exportCSVBtn: createCustomExportCSVButton
    };

    useEffect(() => {
      setLoading(true);
            let data = {
            key: props.match.params.projectKey,
            name: props.match.params.projectName,
            id: props.match.params.id
        }
        axios.post(baseUrl+'/comments', data)
        .then(res => {
          let prqDetail = (res.data.detail).filter((data)=>data.id == props.match.params.id);
          let count = 0;
          res.data.data.values.filter((data)=>{
                if(data.action === 'COMMENTED'){
                    if(!(data.comment.text).includes("YAML validation success")){
                      count++;
                      commentData.push(
                        {
                          id: count,
                          screen : prqDetail[0].screenName,
                          feedback : (data.comment.text).replace(/`/g, ''),
                          developer: prqDetail[0].name,
                          effortMin : "",
                          category: "",
                          subCategory: "",
                          canbecoveredinLinting: "",
                          partofTrainingornot: "",
                          commonAngular: "",
                          actionItems: "",
                          mitigationApproach: "",
                          wasthisfeedbackprovidedearlier:"",
                          source: (data.diff)? data.diff.destination.name : '',
                          PRQcommentsgivenby: data.comment.author.displayName,
                          commentDate: new Date(data.createdDate).toLocaleDateString("en-IN"),
                          commentDateString: data.createdDate,
                          status: ""
                        }
                      )
                    }
                }
            });
            setLoading(false);
            setCommentListState(commentData);
        })
        .catch(err => console.log(err))
    }, []);
    
    return (
      <div className="row nopadding">
        <div className="col-md-12 nopadding">
          <div className="h-100 row align-items-center mrg-200" style={{ display: loading  ? 'block': 'none'}}>
              <div className="col-sm-12 offset-6">
                  <div className="spinner-border my-auto" role="status">
                      <span className="sr-only">Loading...</span>
                  </div>
              </div>
          </div>
          <div id="comment-table" className ="comment-data" style={{ display: loading  ? 'none': 'block'}}> 
            <BootstrapTable data={commentList} striped hover cellEdit={ cellEditProp } options={ options } exportCSV pagination search={ true }>
                <TableHeaderColumn isKey dataField='id' width='3%' columnTitle>Sl.No</TableHeaderColumn>
                <TableHeaderColumn  dataField='screen' columnTitle tdStyle={ { whiteSpace: 'normal' } } >Screen</TableHeaderColumn>
                <TableHeaderColumn dataField='feedback' width='15%' tdStyle={ { whiteSpace: 'normal' } } columnTitle editable={ false }>Feedbacks</TableHeaderColumn>
                <TableHeaderColumn dataField='developer' columnTitle tdStyle={ { whiteSpace: 'normal' } } >Developer</TableHeaderColumn>
                <TableHeaderColumn dataField='effortMin' columnTitle>Efforts Spent<br/> (in mins)</TableHeaderColumn>
                <TableHeaderColumn  dataField='category' columnTitle tdStyle={ { whiteSpace: 'normal' } } editable={ { type: 'select', options: { values: category } } }>Category</TableHeaderColumn>
                <TableHeaderColumn dataField='subCategory' columnTitle tdStyle={ { whiteSpace: 'normal' } } editable={ { type: 'select', options: { values: subCategory } } }>Sub <br/>Category</TableHeaderColumn>
                <TableHeaderColumn  dataField='canbecoveredinLinting' columnTitle editable={ { type: 'select', options: { values: commonAction } } }>Can be <br/>covered in<br/> Linting</TableHeaderColumn>
                <TableHeaderColumn dataField='partofTrainingornot' columnTitle editable={ { type: 'select', options: { values: commonAction } } }>Part of <br/>Training or <br/>not</TableHeaderColumn>
                <TableHeaderColumn dataField='commonAngular' columnTitle  tdStyle={ { whiteSpace: 'normal' } }  editable={ { type: 'select', options: { values: angularKBCPractice } } }>Common <br/>Angular<br/>/KBC Practice</TableHeaderColumn>
                <TableHeaderColumn  dataField='actionItems' columnTitle editable={ { type: 'select', options: { values: actionItem } } }>Action Items</TableHeaderColumn>
                <TableHeaderColumn dataField='mitigationApproach' columnTitle tdStyle={ { whiteSpace: 'normal' } }  editable={ { type: 'select', options: { values: mitigationApproach } } }>Mitigation <br/>Approach</TableHeaderColumn>
                <TableHeaderColumn dataField='wasthisfeedbackprovidedearlier' columnTitle editable={ { type: 'select', options: { values: commonAction } } }>Was this <br/>feedback <br/>provided <br/>earlier</TableHeaderColumn>
                <TableHeaderColumn  dataField='source' columnTitle width='10%' tdStyle={ { whiteSpace: 'normal' } }>Source</TableHeaderColumn>
                <TableHeaderColumn dataField='PRQcommentsgivenby' columnTitle tdStyle={ { whiteSpace: 'normal' } }>PRQ <br/>comments <br/>given by</TableHeaderColumn>
                <TableHeaderColumn dataField='commentDate' columnTitle tdStyle={ { whiteSpace: 'normal' } }>Comment <br/>Date</TableHeaderColumn>
                <TableHeaderColumn  dataField='status' columnTitle editable={ { type: 'select', options: { values: commentStatus } } }>Status</TableHeaderColumn>
            </BootstrapTable>
          </div>
        </div>
      </div>  
    )
}

export default Comments;