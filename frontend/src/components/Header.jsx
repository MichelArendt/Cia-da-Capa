import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMenuStore from '/src/store/menuStore';

import HeaderShared from '/src/components/shared/HeaderShared';
import { Dropdown, DropdownHeader, DropdownOption, DropdownSubmenu } from '/src/components/shared/Dropdown';
import Svg from '/src/components/shared/Svg';

import logo from '/assets/logo_only_text.png';

const Header = () => {
	// const { isOpen, toggleMenu } = useMenuStore();

	// // Store references to elements using useRef
	// const navRef = useRef(null);
	// const closeButtonRef = useRef(null);

	// useEffect(() => {
  //   if (window.innerWidth > 900) {
  //     return;
  //   }

	// 	if( isOpen ) {
	// 		navRef.current.style.width = "100%";
	// 		document.body.style.overflowY = 'hidden';
	// 		console.log(1)
	// 	} else {
	// 		navRef.current.style.width = "0%";
	// 		document.body.style.overflowY = 'auto';
	// 	}
	// }, [ isOpen ]);

	return(
		<HeaderShared>
			<li>
				<Dropdown>
					<DropdownHeader><span>Produtos</span></DropdownHeader>
					<DropdownSubmenu>
						<DropdownOption><Link>Bolsas</Link></DropdownOption>
						<DropdownOption><Link>Bolsas Maternidade</Link></DropdownOption>
						<DropdownOption><Link>Bolsas Ecológicas</Link></DropdownOption>
						<DropdownOption><Link>Bolsas Térmicas</Link></DropdownOption>
						<DropdownOption><Link>Bolsas Viagem</Link></DropdownOption>
						<DropdownOption><Link>Estojos</Link></DropdownOption>
						<DropdownOption><Link>Necessaires</Link></DropdownOption>
						<DropdownOption><Link>Malotes</Link></DropdownOption>
						<DropdownOption><Link>Mochilas</Link></DropdownOption>
						<DropdownOption><Link>Mochilas Saco</Link></DropdownOption>
						<DropdownOption><Link>Shoulder Bags</Link></DropdownOption>
					</DropdownSubmenu>
				</Dropdown>
			</li>
			<li>
				<Link to="/">
					<Svg type="email" sizes={[16,16]} className='display__hide_on-desktop' />
					<span>Contato</span>
				</Link>
			</li>
		</HeaderShared>
		// <header className='poppins-light'>
		// 	<div className='header__contents'>
		// 		<button onClick={toggleMenu} className='display__hide_on-desktop'>
		// 			<Svg type="menu" sizes={[30,30]} />
		// 		</button>

		// 		<Link to="/" className='logo' >
		// 			<img src={logo} alt='Cia da Capa' />
		// 		</Link>

		// 		<nav ref={navRef}>
		// 			<ul className='menu'>
		// 				<li className='display__hide_on-desktop'>
		// 					<Link to="/" className='logo'>
		// 							<img src={logo} alt='Cia da Capa' />
		// 					</Link>
		// 				</li>
		// 				<li>
		// 					<Link to="/">
		// 						<Svg type="home" sizes={[16,16]} className='display__hide_on-desktop' />
		// 						<span>Página Inicial</span>
		// 					</Link>
		// 				</li>
		// 				<li>
		// 					<Dropdown>
		// 						<DropdownHeader><span>Produtos</span></DropdownHeader>
		// 						<DropdownSubmenu>
		// 							<DropdownOption><Link>Bolsas</Link></DropdownOption>
		// 							<DropdownOption><Link>Bolsas Maternidade</Link></DropdownOption>
		// 							<DropdownOption><Link>Bolsas Ecológicas</Link></DropdownOption>
		// 							<DropdownOption><Link>Bolsas Térmicas</Link></DropdownOption>
		// 							<DropdownOption><Link>Bolsas Viagem</Link></DropdownOption>
		// 							<DropdownOption><Link>Estojos</Link></DropdownOption>
		// 							<DropdownOption><Link>Necessaires</Link></DropdownOption>
		// 							<DropdownOption><Link>Malotes</Link></DropdownOption>
		// 							<DropdownOption><Link>Mochilas</Link></DropdownOption>
		// 							<DropdownOption><Link>Mochilas Saco</Link></DropdownOption>
		// 							<DropdownOption><Link>Shoulder Bags</Link></DropdownOption>
		// 						</DropdownSubmenu>
		// 					</Dropdown>
		// 				</li>
		// 				<li>
		// 					<Link to="/">
		// 						<Svg type="email" sizes={[16,16]} className='display__hide_on-desktop' />
		// 						<span>Contato</span>
		// 					</Link>
		// 				</li>
		// 			</ul>
		// 			<button className="button-close display__hide_on-desktop" onClick={toggleMenu} ref={closeButtonRef}>
		// 				<Svg type="close" sizes={[32,32]} className='display__hide_on-desktop' />
		// 			</button>
		// 		</nav>

		// 		<button>
		// 			<Svg type="search" sizes={[30,30]} />
		// 		</button>

		// 		<button>
		// 			<Svg type="remove_shopping_cart" sizes={[30,30]} />
		// 		</button>
		// 	</div>
		// </header>
	)
};

export default Header;