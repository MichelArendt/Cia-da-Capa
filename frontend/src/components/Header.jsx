import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMenuStore from '/src/store/menuStore';

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
				<button onClick={toggleMenu}>
					<Svg type="menu" sizes={[30,30]} />
				</button>

				<Link to="/" className='logo' >
					<img src={logo} alt='Cia da Capa' />
				</Link>

				<nav ref={navRef}>
					<ul>
						<li>
							<Link to="/" className='logo'>
									<img src={logo} alt='Cia da Capa' />
							</Link>
						</li>
						<li>
							<Link to="/">
								<Svg type="home" sizes={[16,16]} />
								<span>Página Inicial</span>
							</Link>
						</li>
						<li>
							<Link onClick={toggleAnimation}>
								<Svg type="shopping_bag" sizes={[16,16]} />
								<span>Produtos</span>
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
						</li>
						<li>
							<Link to="/">
								<Svg type="email" sizes={[16,16]} />
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
					<Svg type="remove_shopping_cart" sizes={[30,30]} />
				</button>
			</div>
		</header>
	)
};

export default Header;