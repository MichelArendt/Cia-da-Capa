import React, { useEffect, useState } from 'react';

// APIs
import { useQueryClient } from '@tanstack/react-query';
import { useProductCategories } from '/src/services/api/usePublicApi';

// Shared components
import ContentLoader from '/src/components/shared/ContentLoader';
import List from '/src/components/shared/smart_content/List';
import CategoryForm from '/src/components/manage/forms/CategoryForm';

const Categories = () => {
  const queryClient = useQueryClient();

  const refreshCategories = () => {
    queryClient.invalidateQueries(['categories']); // Re-fetch categories
  };

  return(
    <>
      <CategoryForm onSave={refreshCategories} />

      <List>
        <h2>Categorias</h2>
        {/* For fetching categories */}
        <ContentLoader hook={useProductCategories} fallbackContent="Não há categorias disponíveis!">
          {(categories) => (
            categories.length !== 0 ?
            <ul>
              {categories.map((category) => (
                <li key={category.id}>{category.name}</li>
              ))}
            </ul>
            : 'Não há categorias disponíveis!'
          )}
        </ContentLoader>
      </List>
    </>
  );
}
export default Categories;
