import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Assets
import logo from '/assets/logo_manage.png';

// Shared components
import Header from '/src/components/shared/Header';
import Svg from '/src/components/shared/Svg';
import { Dropdown, DropdownHeader, DropdownSubmenu, DropdownOption } from '/src/components/shared/Dropdown';

// /manage components
import Home from '/src/pages/manage/Home';

function Manage() {
  return (
    <>
      <Header admin={true} logo={logo}>
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
            <Svg type="home" sizes={[16,16]} className='display__hide_on-desktop' />
            <span>Categorias</span>
          </Link>
        </li>
        <li>
          <Link to="/">
            <Svg type="home" sizes={[16,16]} className='display__hide_on-desktop' />
            <span>Banners</span>
          </Link>
        </li>
      </Header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </>
  );
}

export default Manage;