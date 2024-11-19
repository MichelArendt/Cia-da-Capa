import React from 'react';
// import SmartContent, { SmartContentHeader, SmartContentBody, SmartContentType } from '/src/components/shared/SmartContent';
import { Link } from 'react-router-dom';
import Collapsible from '/src/components/shared/smart_content/Collapsible';
import Dropdown from '/src/components/shared/smart_content/Dropdown';
import List from '/src/components/shared/smart_content/List';
import Select from '/src/components/shared/smart_content/Select';
import Slider from '/src/components/shared/smart_content/Slider';
// import { Dropdown, DropdownHeader, DropdownSubmenu, DropdownOption } from '/src/components/shared/Dropdown';

function Contact() {
  return (
    <>
    <Dropdown>
      <div>Dropdown</div>
      <div><Link to='/'>Home</Link></div>
      <div>Dropdown Item 2</div>
    </Dropdown>
    </>
  );
}

export default Contact;