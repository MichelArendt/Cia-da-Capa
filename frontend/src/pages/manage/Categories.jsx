import React, { useEffect, useState } from 'react';

// APIs
import {apiPublic, apiManage} from '/src/services/api';

const Categories = () => {
  const [ categories, setCategories ] = useState([]);

  useEffect(() => {
    const listCategories = async () => {

      try {
        const response = await apiPublic.products.listCategories();
        console.log({response})
        console.log(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    console.log(1)
    listCategories();
  }, []);

  return(
    <>
      <h2>Categories</h2>
      {categories.length === 0 ? (
        <p>Nenhuma categoria cadastrada</p>
      ) : (
        <ul>
          {categories.map((category, index) => (
            <li key={index}>{category.name}</li>
          ))}
        </ul>
      )}
    </>
  );
}
export default Categories;
