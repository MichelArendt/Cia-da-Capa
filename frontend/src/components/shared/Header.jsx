import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Authorization
import useStore from '/src/store';

import useMenuStore from '/src/store/menuStore';

// Shared
import Dropdown from '/src/components/shared/smart_content/Dropdown';
import ContentLoader from '/src/components/shared/ContentLoader';
import Svg from '/src/components/shared/Svg';
import defaultLogo from '/assets/logo_only_text.png';

// APIs
import Slider from '/src/components/shared/smart_content/Slider';

const Header = ({
	isManageRoute = false,
	logo = defaultLogo,
	navResponsiveMenuOptions,
	navPermanentButtons
}) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const isMobile = useStore((state) => state.isMobile);

	return(
		<header className='website__header poppins-light'>
			<div className='website__header-wrapper'>
				<nav className='website__nav'>
					{/* Hide menu if manage route and not authenticated */}
					{(!isManageRoute || isAuthenticated) && (

						isMobile ?
							<Slider
								headerClassName='nav__button nav--interactive'
								mobileContentTitle={
									<Link
										to={`/${isManageRoute ? 'manage' : ''}`}
										className='header__logo'
									>
										<img src={logo} alt={`Cia da Capa ${isManageRoute ? '- Gerenciamento' : ''}`} />
									</Link>
								}
								slideInFromDirection='left'
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
				</nav>

				{/* Hide permanent buttons if manage route and not authenticated */}
				{(!isManageRoute || isAuthenticated) ? navPermanentButtons : ''}
			</div>
		</header>
	)
};

export default Header;