import React from 'react';
import { Dropdown, DropdownHeader, DropdownOption, DropdownSubmenu } from '../components/shared/Dropdown';
import { Link } from 'react-router-dom';

const Home = () => (
		<div>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultrices risus sit amet felis tempus, sed vehicula metus ullamcorper. Nullam id ligula id mi bibendum vulputate. Proin maximus lectus in nulla posuere, sed blandit mauris tempor. Nam imperdiet porttitor ligula, id volutpat lorem luctus eu. Cras non nisi vulputate, viverra mauris vel, euismod lectus. Phasellus viverra, arcu vitae consequat rhoncus, eros ligula imperdiet nulla, eu bibendum felis mi sed elit. Praesent sodales metus vel dolor interdum elementum. Nunc laoreet tempus euismod.
			<Dropdown>
				<DropdownHeader><span>Produtos</span></DropdownHeader>
				<DropdownSubmenu>
					<DropdownOption><Link>Bolsas</Link></DropdownOption>
					<DropdownOption><Link>Estojos</Link></DropdownOption>
					<DropdownOption><Link>Necessaires</Link></DropdownOption>
				</DropdownSubmenu>
			</Dropdown>
		</div>
	);

	export default Home;