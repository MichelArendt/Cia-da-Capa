import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMenuStore from '/src/store/menuStore';

import DropdownNav from '/src/components/shared/navigation/DropdownNav';
import Dropdown from '/src/components/shared/Dropdown';
import Svg from '/src/components/shared/Svg';

import logo from '/assets/logo.png';

const Header = () => {
	const [open, setOpen] = useState('')
	const { isOpen, toggleMenu } = useMenuStore();

	// Animation
  const [showList, setShowList] = useState(false);
  const [triggerAnimation, setTriggerAnimation] = useState(false);
  const handleToggle = () => {
    // Temporarily remove show-list class to reset animation
    setTriggerAnimation(false);
    setTimeout(() => {
      setTriggerAnimation(true); // Reapply show-list class after delay
      setShowList((prev) => !prev);
    }, 10); // Small delay to reset animation
  };

	// Store references to elements using useRef
	const navRef = useRef(null);
	const closeButtonRef = useRef(null);

	const navigationClicked = () => {
		setOpen((prev) => (prev === '' ? 'open' : ''));
	};

	useEffect(() => {
		if( isOpen ) {
			navRef.current.style.width = "100%";
			document.body.style.overflowY = 'hidden';
		} else {
			navRef.current.style.width = "0%";
			document.body.style.overflowY = 'auto';
		}
	}, [ isOpen ]);

	return(
		<header>
			<div className='header__contents'>
				<button className='menu__button' onClick={toggleMenu}>
					<Svg type="menu" sizes={[30,30]} />
				</button>

				<Link to="/">
					<img src={logo} alt='Cia da Capa' className='logo' />
				</Link>

				<nav ref={navRef}>
					<ul>
						<li>
							<Link to="/">
									<img src={logo} alt='Cia da Capa' className='logo' />
							</Link>
						</li>
						<li>
							<Link to="/">
								<Svg type="home" />
								<span>Página Inicial</span>
							</Link>
						</li>
						<li>
							<Link onClick={handleToggle}>
								<Svg type="shopping_bag" />
								<span>Produtos</span>
							</Link>
							<ul className={`dropdown__submenu ${triggerAnimation  ? 'show-list' : ''}`}>
								<li style={{ animationDelay: "0s" }}><Link to='/produtos'>Bolsas</Link></li>
								<li style={{ animationDelay: "0.1s" }}><Link to='/produtos'>Bolsas</Link></li>
								<li style={{ animationDelay: "0.2s" }}><Link to='/produtos'>Bolsas Ecológicas</Link></li>
								<li style={{ animationDelay: "0.3s" }}><Link to='/produtos'>Bolsas Térmicas</Link></li>
								<li style={{ animationDelay: "0.4s" }}><Link to='/produtos'>Bolsas Viagem</Link></li>
								<li style={{ animationDelay: "0.5s" }}><Link to='/produtos'>Estojos</Link></li>
								<li style={{ animationDelay: "0.6s" }}><Link to='/produtos'>Necessaires</Link></li>
								<li style={{ animationDelay: "0.7s" }}><Link to='/produtos'>Malotes</Link></li>
								<li style={{ animationDelay: "0.8s" }}><Link to='/produtos'>Mochilas</Link></li>
								<li style={{ animationDelay: "0.9s" }}><Link to='/produtos'>Mochilas Saco</Link></li>
								<li style={{ animationDelay: "1s" }}><Link to='/produtos'>Shoulder Bags</Link></li>
							</ul>
						</li>
						<li>
							<Link to="/">
								<Svg type="email" />
								<span>Contato</span>
							</Link>
						</li>
					</ul>
					<span className="close_button" onClick={toggleMenu} ref={closeButtonRef}>&times;</span>
				</nav>

				<button>
					<Svg type="search" sizes={[30,30]} />
				</button>

				<button>
					<Svg type="local_atm" sizes={[30,30]} />
				</button>

				{/* <nav className='nav__link-style poppins-light' ref={navRef}>
					<div className='nav__contents'>
						<Link to="/" className='nav__option' style={{height: '40px'}}>
								<img src={logo} alt='Cia da Capa' className='logo' />
						</Link>

						<Link to="/" className={`nav__option `} onClick={navigationClicked}>
							<Svg type="home" /> <span>Página Inicial</span>
						</Link>

						<div className={`nav__option ${open}`} onClick={navigationClicked}>
							<Dropdown title='Produtos'>
								<Link to='/produtos'>Bolsas</Link>
								<Link to='/produtos'>Bolsas Maternidade</Link>
								<Link to='/produtos'>Bolsas Ecológicas</Link>
								<Link to='/produtos'>Bolsas Térmicas</Link>
								<Link to='/produtos'>Bolsas Viagem</Link>
								<Link to='/produtos'>Estojos</Link>
								<Link to='/produtos'>Necessaires</Link>
								<Link to='/produtos'>Malotes</Link>
								<Link to='/produtos'>Mochilas</Link>
								<Link to='/produtos'>Mochilas Saco</Link>
								<Link to='/produtos'>Pastas</Link>
								<Link to='/produtos'>Shoulder Bags</Link>
							</Dropdown>
						</div>

						<Link className={`nav__option `} onClick={navigationClicked} to="/contato">
							<Svg type="email" /> <span>Contato</span>
						</Link>

						<div className={`nav__option`} onClick={navigationClicked}>
							<Svg type="search" /> <span>Pesquisa</span>
						</div>

						<div className={`nav__option`} onClick={navigationClicked}>
							<Svg type="local_atm" /> <span>Orçamento</span>
						</div>
					</div>
					<span className="nav__close_button" onClick={toggleMenu} ref={closeButtonRef}>&times;</span>
				</nav> */}
			</div>
		</header>
	)
};

export default Header;