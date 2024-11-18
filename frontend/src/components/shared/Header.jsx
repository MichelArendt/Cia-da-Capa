import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Authorization
import useStore from '/src/store';

import useMenuStore from '/src/store/menuStore';

// Shared
// import Dropdown from '/src/components/shared/smart_content/Dropdown';
import Dropdown from '/src/components/shared/smart_content/Dropdown';
import SmartContent, { SmartContentHeader, SmartContentBody, SmartContentType } from '/src/components/shared/SmartContent';
import ContentLoader from '/src/components/shared/ContentLoader';
import Svg from '/src/components/shared/Svg';
import defaultLogo from '/assets/logo_only_text.png';
// import Hierarchy, { HierarchyType } from '/src/components/shared/Hierarchy';

// APIs
import {apiPublic} from '/src/services/api';
import useIsWebsiteMobile from '/src/hooks/useIsWebsiteMobile';
import Slider from '/src/components/shared/smart_content/Slider';

const Header = ({
	isManageRoute = false,
	logo = defaultLogo,
	navResponsiveMenuOptions,
	navPermanentButtons,
	children }
) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
	const { isOpen, toggleMenu } = useMenuStore();
  const isWebsiteMobile = useIsWebsiteMobile();


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
		<header className='website__header section--full-width poppins-light'>
				<nav className='website__nav website--max-width'>
					{/* Hide menu if manage route and not authenticated */}
					{(!isManageRoute || isAuthenticated) && (
						isWebsiteMobile ?
							<Slider
								headerClassName='nav__button'
								mobileContentTitle='Menu Cia da Capa' slideInFromDirection='left'
							>
								<Svg type="menu" sizes={[35,35]} />
								{navResponsiveMenuOptions}
							</Slider>
							: navResponsiveMenuOptions
					)}


					<Link
						to={`/${isManageRoute ? 'manage' : ''}`}
						className='header__logo'
					>
						<img src={logo} alt={`Cia da Capa ${isManageRoute ? '- Gerenciamento' : ''}`} />
					</Link>
					{/* //  (

					// 	// <SmartContent
					// 	// 	contentType={SmartContentType.Dropdown}
					// 	// 	className='website__menu'
					// 	// >
					// 	// 	<SmartContentHeader
					// 	// 		hideArrow={true}
					// 	// 		className='smart-content__header--nav smart-content__header--button'
					// 	// 	>
					// 	// 		<Svg type="menu" sizes={[35,35]} />
					// 	// 	</SmartContentHeader>

					// 	// 	<SmartContentBody className=''>
					// 	// 		<Link to={`/${isManageRoute ? 'manage' : ''}`} className='' >
					// 	// 			<img src={logo} alt={`Cia da Capa ${isManageRoute ? '- Gerenciamento' : ''}`} />
					// 	// 		</Link>
					// 	// 		{navResponsiveMenuOptions}
					// 	// 	</SmartContentBody>
					// 	// </SmartContent>
					// ) : ''} */}

					{/* <Link to={`/${isManageRoute ? 'manage' : ''}`} className='header__logo' >
						<img src={logo} alt={`Cia da Capa ${isManageRoute ? '- Gerenciamento' : ''}`} />
					</Link> */}
				</nav>
				{/* Hide permanent buttons if manage route and not authenticated */}

				{(!isManageRoute || isAuthenticated) ? navPermanentButtons : ''}


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