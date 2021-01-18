import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {baseUrl} from '../Constant';

function ListofProject() {
    const [projectList, setProjectListState] = useState([]);
    const [search, setSearch] = React.useState('');
    const [filterProjects, setFilterProject] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        setLoading(true);
        axios.get(baseUrl+'/projects')
        .then(res => {
            setProjectListState(res.data.values);
            setLoading(false);
        })
        .catch(err => console.log(err))
    },[]);

    useEffect(()=>{
        if(projectList) {
            const newList = projectList.filter( project  => {
                return ((project.name).toLowerCase()).includes(search.toLowerCase())
            });
            setFilterProject(newList);
        }
    },[search, projectList]);
    
    return (
        
        <div className="row nopadding">
            <div className="col-md-12 nopadding">
                <div className="row padding-15">
                    <div className="col-md-3 text-color"><h3>Projects</h3></div>
                    <div className="col-md-9 ">
                        <input type="text" placeholder="Enter project to be searched" className="float-right" onChange={e=>setSearch(e.target.value)}/>
                    </div>
                </div>
                <div className="h-100 row align-items-center mrg-200" style={{ display: loading  ? 'block': 'none'}}>
                    <div className="col-sm-12 offset-6">
                        <div className="spinner-border my-auto" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <ul className="list-group list-group-flush">
                            {filterProjects.map((data, i)=>  <li id={i} key={i} className="list-group-item">  <a href={`/projects/${data.key}`}>{data.name}</a></li>)}
                        </ul>
                    </div>
                </div>    
            </div>
        </div>   
    )
}

export default ListofProject
