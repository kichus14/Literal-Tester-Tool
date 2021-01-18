import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {baseUrl} from '../Constant';

function ListofRepositories(props) {
    const [loading, setLoading] = useState(false);
    const [repositoriesList, setRepositoriesListState] = useState([]);
    const [leftHeading, setLeftHeading] = useState();
    const postData = {key: props.match.params.projectKey};
    //let leftHeading;
    useEffect(() => {
        setLoading(true);
        axios.post(baseUrl+'/repositoriesLists', postData)
        .then(res => {
            setLeftHeading(res.data.values[0].project.name);
            setRepositoriesListState(res.data.values);
            setLoading(false);
        })
        .catch(err => console.log(err))
    },[])
    return (
        <div className="row">
            <div className="col-md-3  left-content mh-100" style={{ display: loading  ? 'none': 'block'}}>
                <h2 className="entity-name">{leftHeading}</h2>
            </div>
            <div className="col-md-9 nopadding">
                <div className="row padding-15" >
                    <div className="col-md-12 ">
                        <div className="text-color" style={{ display: loading  ? 'none': 'block'}}><h3>Repositories</h3></div>
                    </div>
                </div>
                <div className="h-100 row align-items-center mrg-200" style={{ display: loading  ? 'block': 'none'}}>
                    <div className="col-sm-12 offset-8">
                        <div className="spinner-border my-auto" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 ">
                    <ul className="list-group list-group-flush">
                        {repositoriesList.map((data, i)=> <li id={i} key={i} className="list-group-item"><a href={`/pull-request/${data.project.key}/${data.name}`}>{data.name}</a></li>)}
                    </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListofRepositories
