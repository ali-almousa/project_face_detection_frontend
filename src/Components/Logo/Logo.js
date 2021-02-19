import React from 'react';
import Tilt from 'react-tilt';
import eye from './eye.png'
import './Logo.css';

const Logo = () => {
	return(
		<div className='ma4 mt0' style={{position:'relative'}}>
			<Tilt className="Tilt br4 shadow-5 pointer" options={{ max : 55, speed : 500}} style={{ height: 250, width: 250 }} >
			 <div className="Tilt-inner pa3"> 
			 	<img alt='logo' src={eye}/> 
			 </div>
			</Tilt>
		</div>
		);
}

export default Logo; 