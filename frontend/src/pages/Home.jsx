import React from 'react';
// import SmartContent, { SmartContentHeader, SmartContentBody, SmartContentType } from '/src/components/shared/SmartContent';
import { Link } from 'react-router-dom';
import Collapsible from '/src/components/shared/smart_content/Collapsible';
import Dropdown from '/src/components/shared/smart_content/Dropdown';
import List from '/src/components/shared/smart_content/List';
import Select from '/src/components/shared/smart_content/Select';
import Slider from '/src/components/shared/smart_content/Slider';
// import { Dropdown, DropdownHeader, DropdownSubmenu, DropdownOption } from '/src/components/shared/Dropdown';

function Home() {
  return (
    <>
    <Dropdown>
      <div>Dropdown</div>
      <div><Link to='/contact'>Contato</Link></div>
      <div>Dropdown Item 2</div>
    </Dropdown>

    <Slider slideDirection="left">
      <div>Slider Header</div>
      <div>Slider Content Line 1</div>
      <div>Slider Content Line 2</div>
    </Slider>

    <Select>
      <div>Select Header</div>
      <div>Select Option 1</div>
      <div>Select Option 2</div>
    </Select>

    <Collapsible>
      <div>Collapsible Header</div>
      <div>Collapsible Content Line 1</div>
      <div>Collapsible Content Line 2</div>
    </Collapsible>

    <List orientation="horizontal">
      <div>Produtos:</div>
      <div>List Item 1</div>
      <div>List Item 2</div>
      <div>List Item 3</div>
    </List>

      <br /><div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In finibus vel mi at sagittis. Nullam feugiat purus ac turpis consectetur tristique. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc in justo sed lectus euismod viverra lobortis a ipsum. Morbi lobortis, elit non semper luctus, libero felis ullamcorper quam, vitae malesuada massa enim sit amet tortor. Etiam quis magna arcu. Donec scelerisque libero a mi dapibus vestibulum. Praesent sodales arcu a luctus suscipit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris ut pulvinar ipsum, vel tristique magna. Fusce est dui, dignissim sed nisi non, facilisis porttitor dolor.

        Cras id elit sed sem fermentum vehicula. In pulvinar, risus id sagittis congue, lectus lacus facilisis tortor, eget ullamcorper ex orci quis lectus. Donec non sapien nec metus semper molestie. Aliquam accumsan leo in risus gravida, eget fringilla tellus suscipit. Aliquam sed ipsum aliquam, pharetra tortor in, molestie dolor. Pellentesque tincidunt varius nisi nec molestie. Curabitur a varius mi. Aenean volutpat mi eget consectetur aliquam. Etiam mattis, justo sit amet cursus tempor, ligula lorem vestibulum purus, sit amet euismod massa urna ac quam. Nullam et hendrerit dolor. Donec quis dignissim risus, sit amet iaculis nunc. Phasellus rhoncus dolor eget porta gravida. In tincidunt, lorem sed commodo suscipit, lorem nisi pulvinar ante, et egestas nulla lectus vitae dolor. Praesent egestas viverra tincidunt.

        Etiam blandit vitae purus et ornare. Donec eros mi, semper a ante in, tristique bibendum est. In condimentum condimentum sem eu eleifend. Vestibulum interdum pulvinar odio at luctus. Cras at mauris et neque mollis scelerisque non at diam. Mauris ultricies dolor vitae velit faucibus tincidunt. Nunc auctor bibendum sem. Phasellus nec elit massa. Suspendisse ac imperdiet neque. Fusce fringilla nisi fermentum suscipit rutrum. Curabitur tristique sit amet velit et efficitur. Morbi eget ligula sit amet mi luctus imperdiet. Etiam et nisi magna.

        Cras eu commodo odio. Mauris ac quam ante. Donec et fermentum metus. Suspendisse vel turpis leo. Quisque sit amet interdum leo, quis consectetur odio. Nunc non dui porttitor, euismod quam vitae, vestibulum eros. Nam quis neque consectetur, feugiat ipsum id, sagittis sem. Vestibulum malesuada neque pharetra congue vestibulum. Aliquam efficitur arcu eros, convallis porttitor libero imperdiet id. Nulla consectetur efficitur velit, eget porta dolor sollicitudin ac. Etiam semper, est et auctor congue, nibh felis lacinia quam, sit amet vestibulum enim dui placerat sapien. Phasellus sed ex sed ex malesuada ultrices. Cras ultrices varius metus non vestibulum.

        Fusce lacinia commodo urna, quis efficitur urna laoreet volutpat. Nam tincidunt, nibh vitae pharetra tristique, magna massa interdum purus, eget tincidunt nulla lacus sit amet arcu. Integer a libero dictum, maximus urna nec, lobortis metus. Sed tortor urna, consectetur id varius vel, placerat quis augue. Ut quis nunc in dolor egestas placerat at non nibh. Sed aliquet dolor sed nisi faucibus, eu fringilla quam lobortis. Sed hendrerit lorem urna, in luctus ante venenatis et. Morbi in hendrerit turpis. Pellentesque id accumsan risus, id posuere libero. Proin aliquam, urna molestie facilisis pharetra, enim diam auctor diam, ut sagittis nunc purus ut nisl. Aliquam vulputate, quam at porta vestibulum, orci risus finibus erat, luctus iaculis magna lacus at turpis. Donec semper eget dui ac pellentesque. Pellentesque eleifend justo libero, quis facilisis magna lacinia nec. Aenean accumsan ex in viverra interdum. Nulla id accumsan ipsum. Aliquam sollicitudin vel metus et convallis.
      </div>
    </>
  );
}

export default Home;