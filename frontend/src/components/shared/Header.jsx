import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Authorization
import useStore from '/src/store';

import useMenuStore from '/src/store/menuStore';

// Shared
// import { Dropdown, DropdownHeader, DropdownSubmenu } from '/src/components/shared/Dropdown';
import Svg from '/src/components/shared/Svg';

import defaultLogo from '/assets/logo_only_text.png';
// import Hierarchy, { HierarchyType } from '/src/components/shared/Hierarchy';


const Header = ({ isManageRoute = false, logo = defaultLogo, navOptions, navButtons, children }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
	const { isOpen, toggleMenu } = useMenuStore();


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
		<header className='section--full-width flex flex--row flex--row--center-horizontal poppins-light'>
				<nav className='website--max-width flex'>
					{/* <Hierarchy>
						<Hierarchy.Item label="Click to expand" isCollapsible>
							<p>This content can be expanded or collapsed.</p>
						</Hierarchy.Item>
					</Hierarchy> */}












					{/* <Dropdown>
						<DropdownHeader sizes={[12,12]}>
							<button
								className=''
								onClick={toggleMenu}
							>
								<Svg type="menu" sizes={[30,30]} />
							</button>
						</DropdownHeader>
						<DropdownSubmenu>
							{children}
						</DropdownSubmenu>
					</Dropdown>

					<Link to={`/${isManageRoute ? 'manage' : ''}`} className='logo' >
						<img src={logo} alt={`Cia da Capa ${isManageRoute ? '- Gerenciamento' : ''}`} />
					</Link>
					<button className="button-close " onClick={toggleMenu} ref={closeButtonRef}>
						<Svg type="close" sizes={[32,32]} className='' />
					</button> */}
				</nav>


			{/* <div className='website--max-width'>
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
			</div> */}
		</header>
	)
};

export default Header;