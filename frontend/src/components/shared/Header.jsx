import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Authorization
import useStore from '/src/store';
import useAuthStore from '/src/store/authStore';

import useMenuStore from '/src/store/menuStore';

// Shared
import Dropdown from '/src/components/shared/smart_content/Dropdown';
import ContentLoader from '/src/components/shared/ContentLoader';
import Svg from '/src/components/shared/Svg';
import defaultLogo from '/assets/logo_only_text.png';

// APIs
import Slider from '/src/components/shared/smart_content/Slider';

// Debug
import useRenderCount from '/src/hooks/debug/useRenderCount';

const Header = ({
	isManageRoute = false,
	logo = defaultLogo,
	navResponsiveMenuOptions,
	navPermanentButtons
}) => {
  useRenderCount(Header);
  const isMobile = useStore((state) => state.isMobile);

  // Fetch isAuthenticated only if isManageRoute is true
  const isAuthenticated = isManageRoute ? useAuthStore((state) => state.isAuthenticated) : null;
	console.log(isAuthenticated)

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


					{isAuthenticated ?
						<Link
							to={`/${isManageRoute ? 'manage' : ''}`}
							className='header__logo'
						>
							<img src={logo} alt={`Cia da Capa ${isManageRoute ? '- Gerenciamento' : ''}`} />
						</Link>
					:
						<span
							to={`/${isManageRoute ? 'manage' : ''}`}
							className='header__logo'
						>
							<img src={logo} alt={`Cia da Capa ${isManageRoute ? '- Gerenciamento' : ''}`} />
						</span>
					}
					{/* <Link
						to={`/${isManageRoute ? 'manage' : ''}`}
						className='header__logo'
					>
						<img src={logo} alt={`Cia da Capa ${isManageRoute ? '- Gerenciamento' : ''}`} />
					</Link> */}
				</nav>

				{/* Hide permanent buttons if manage route and not authenticated */}
				{/* {console.log('HEADER isAuthenticated:', isAuthenticated)} */}
				{(!isManageRoute || isAuthenticated) ? navPermanentButtons : ''}
			</div>
		</header>
	)
};

export default Header;