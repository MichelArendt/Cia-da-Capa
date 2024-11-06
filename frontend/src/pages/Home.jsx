import React from 'react';
import { Dropdown, DropdownHeader, DropdownSubmenu, DropdownOption } from '/src/components/shared/Dropdown';

function Home() {
  return <div>Welcome to the Home Page!
    <Dropdown>
      <DropdownHeader><span>Produtos</span></DropdownHeader>
      <DropdownSubmenu>
        <DropdownOption>asdf</DropdownOption>
        {/* <DropdownOption><Link>Bolsas</Link></DropdownOption>
        <DropdownOption><Link>Bolsas Maternidade</Link></DropdownOption>
        <DropdownOption><Link>Bolsas Ecológicas</Link></DropdownOption>
        <DropdownOption><Link>Bolsas Térmicas</Link></DropdownOption>
        <DropdownOption><Link>Bolsas Viagem</Link></DropdownOption>
        <DropdownOption><Link>Estojos</Link></DropdownOption>
        <DropdownOption><Link>Necessaires</Link></DropdownOption>
        <DropdownOption><Link>Malotes</Link></DropdownOption>
        <DropdownOption><Link>Mochilas</Link></DropdownOption>
        <DropdownOption><Link>Mochilas Saco</Link></DropdownOption>
        <DropdownOption><Link>Shoulder Bags</Link></DropdownOption> */}
      </DropdownSubmenu>
    </Dropdown>
  </div>;
}

export default Home;