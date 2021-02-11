import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className="navbar-brand">KBC - Angular Migration - Literal Tester</div> 
            <ul>
                <li><Link to='/'>Literals Tester</Link></li>
                <li><Link to='/legecy-literals'>Legecy literals</Link></li>
            </ul>
        </nav>
    )
}

export default Header