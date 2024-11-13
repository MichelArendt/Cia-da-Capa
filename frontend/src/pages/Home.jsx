import React from 'react';
import SmartContent, { SmartContentHeader, SmartContentBody, SmartContentType } from '/src/components/shared/SmartContent';
import { Link } from 'react-router-dom';
// import { Dropdown, DropdownHeader, DropdownSubmenu, DropdownOption } from '/src/components/shared/Dropdown';

function Home() {
  return (
    <>
      <div>Welcome to the Home Page!</div>
      <SmartContent
        contentType={SmartContentType.Dropdown}
      >
        <SmartContentHeader>
          Dropdown
        </SmartContentHeader>

        <SmartContentBody title="Menu">
          <button>Link 1</button>
          <button>Link 2</button>
          <button>Link 3</button>
        </SmartContentBody>
      </SmartContent>

      <div>Welcome to the Home Page!</div>
      <SmartContent
        contentType={SmartContentType.Select}
      >
        <SmartContentHeader>
        Select
        </SmartContentHeader>

        <SmartContentBody title="Selecione um link">
          <div>Option 1</div>
          <div>Option 2</div>
          <div>Option 3</div>
          <div>Option 4</div>
        </SmartContentBody>
      </SmartContent>

      <div>Welcome to the Home Page!</div>
      <SmartContent
        contentType={SmartContentType.Collapsible}
      >
        <SmartContentHeader>
          Collapsible
        </SmartContentHeader>

        <SmartContentBody>
          <a href="#link1">Link 1</a>
          <a href="#link2">Link 2</a>
          <a href="#link3">Link 3</a>
        </SmartContentBody>
      </SmartContent>

      <div>Welcome to the Home Page!</div>
      <SmartContent
        contentType={SmartContentType.List}
      >
        <SmartContentHeader>
          <Link to='/test'>Nav - this is a link to a page</Link>
        </SmartContentHeader>

        <SmartContentBody>
          <a href="#link1">Link 1</a>
          <a href="#link2">Link 2</a>
          <a href="#link3">Link 3</a>
        </SmartContentBody>
      </SmartContent>


      <div>Welcome to the Home Page!</div>
      <SmartContent
        contentType={SmartContentType.List}
      >
        <SmartContentHeader>
          Dropdown with list nested
        </SmartContentHeader>

        <SmartContentBody>
          <a href="#link1">Link 1</a>
          <SmartContent
            contentType={SmartContentType.List}
          >
            <SmartContentHeader>
              List
            </SmartContentHeader>

            <SmartContentBody>
              <a href="#link1">Link 4</a>
              <a href="#link2">Link 5</a>
              <a href="#link3">Link 6</a>
            </SmartContentBody>
          </SmartContent>
          <a href="#link1">Link 2</a>
          <a href="#link1">Link 3</a>
        </SmartContentBody>
      </SmartContent>

      <div>Welcome to the Home Page!</div>
    </>
  );
}

export default Home;