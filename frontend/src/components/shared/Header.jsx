import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Authorization
import useStore from '/src/store';

import useMenuStore from '/src/store/menuStore';

// import { Dropdown, DropdownHeader, DropdownOption, DropdownSubmenu } from '/src/components/shared/Dropdown';
import Svg from '/src/components/shared/Svg';

import defaultLogo from '/assets/logo_only_text.png';

const Header = ({ isManageRoute = false, logo = defaultLogo, navOptions, navButtons }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
	const { isOpen, toggleMenu } = useMenuStore();


	// Store references to elements using useRef
	const navRef = useRef(null);
	const closeButtonRef = useRef(null);

	useEffect(() => {
    if (window.innerWidth > 900) {
      return;
    }

		if( isOpen ) {
			navRef.current.style.width = "100%";
			document.body.style.overflowY = 'hidden';
			console.log(1)
		} else {
			navRef.current.style.width = "0%";
			document.body.style.overflowY = 'auto';
		}
	}, [ isOpen ]);

	return(
		<header className='poppins-light'>
			<div className='header__contents'>
				<button onClick={toggleMenu} className='display__hide_on-desktop'>
					<Svg type="menu" sizes={[30,30]} />
				</button>

				<Link to={`/${isManageRoute ? 'manage' : ''}`} className='logo' >
					<img src={logo} alt={`Cia da Capa ${isManageRoute ? '- Gerenciamento' : ''}`} />
				</Link>

				<nav ref={navRef}>
					<ul className='menu'>
						<li className='display__hide_on-desktop'>
							<Link to={`/${isManageRoute ? 'manage' : ''}`} className='logo'>
									<img src={logo} alt='Cia da Capa' />
							</Link>
						</li>
            {(!isManageRoute || isAuthenticated) ? navOptions : ''}
					</ul>
					<button className="button-close display__hide_on-desktop" onClick={toggleMenu} ref={closeButtonRef}>
						<Svg type="close" sizes={[32,32]} className='display__hide_on-desktop' />
					</button>
				</nav>
				{(!isManageRoute || isAuthenticated) ? navButtons : ''}
			</div>
		</header>
	)
};

export default Header;