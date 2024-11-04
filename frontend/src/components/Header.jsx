import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMenuStore from '/src/store/menuStore';

import { Dropdown, DropdownHeader, DropdownOption, DropdownSubmenu } from '../components/shared/Dropdown';
import Svg from '/src/components/shared/Svg';

import logo from '/assets/logo_only_text.png';

const Header = () => {
	const [open, setOpen] = useState('')
	const { isOpen, toggleMenu } = useMenuStore();

	// Animation
  const [showList, setShowList] = useState(false);
  const [triggerAnimation, setTriggerAnimation] = useState(false);
  const toggleAnimation = () => {
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

				<Link to="/" className='logo' >
					<img src={logo} alt='Cia da Capa' />
				</Link>

				<nav ref={navRef}>
					<ul className='menu'>
						<li className='display__hide_on-desktop'>
							<Link to="/" className='logo'>
									<img src={logo} alt='Cia da Capa' />
							</Link>
						</li>
						<li>
							<Link to="/">
								<Svg type="home" sizes={[16,16]} className='display__hide_on-desktop' />
								<span>Página Inicial</span>
							</Link>
						</li>
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


						{/* <li className='dropdown__container'>
							<Link onClick={toggleAnimation}>
								<Svg type="shopping_bag" sizes={[16,16]} className='display__hide_on-desktop' />
								<span>Produtos</span>
								<Svg type="arrow_drop_down" sizes={[10,10]} className='display__hide_on-mobile' />
							</Link>
							<ul className={`dropdown__submenu ${triggerAnimation  ? 'show-list' : ''}`}>
								<li style={{ animationDelay: "0s" }}><Link to='/produtos'>Bolsas</Link></li>
								<li style={{ animationDelay: "0.1s" }}><Link to='/produtos'>Bolsas Maternidade</Link></li>
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
						</li> */}


						<li>
							<Link to="/">
								<Svg type="email" sizes={[16,16]} className='display__hide_on-desktop' />
								<span>Contato</span>
							</Link>
						</li>
					</ul>
					<button className="button-close display__hide_on-desktop" onClick={toggleMenu} ref={closeButtonRef}>
						<Svg type="close" sizes={[32,32]} className='display__hide_on-desktop' />
					</button>
				</nav>

				<button>
					<Svg type="search" sizes={[30,30]} />
				</button>

				<button>
					<Svg type="remove_shopping_cart" sizes={[30,30]} />
				</button>
			</div>
		</header>
	)
};

export default Header;