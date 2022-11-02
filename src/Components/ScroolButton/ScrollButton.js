import React, {useState} from 'react';
import {FaArrowCircleUp} from 'react-icons/fa';
import './scrollButton.css'
import { Button } from './Styles';

const ScrollButton = () =>{

const [visible, setVisible] = useState(false)

const toggleVisible = () => {
	const scrolled = document.documentElement.scrollTop;
	if (scrolled > 1){
	setVisible(true)
	}
	else if (scrolled <= 1){
	setVisible(false)
	}
};

const scrollToTop = () =>{
	window.scrollTo({
	top: 0,
	behavior: 'smooth'
	/* you can also use 'auto' behaviour
		in place of 'smooth' */
	});
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
		/* you can also use 'auto' behaviour
			in place of 'smooth' */
		});
};

window.addEventListener('scroll', toggleVisible);
// window.removeEventListener('scroll', toggleVisible);

return (
	<Button id='button-scroll'>
	<FaArrowCircleUp onClick={scrollToTop}
	style={{display: visible ? 'inline' : 'none'}} />
	</Button>

);
}

export default ScrollButton;