import React, { useState, useEffect } from 'react';

// API
// import { apiManage } from '/src/services/api/_axiosInstance';
import { useCreateProductCategory } from '/src/services/api/useManageApi';
import Feedback from '/src/components/shared/feedback/Feedback';

const CategoryForm = ({ category = null, onSave }) => {
  // Define state for form inputs, pre-fill if editing
  const [formData, setFormData] = useState({
    name: category?.name || '',
    reference: category?.reference || '',
    is_active: category?.is_active ?? true,
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    // Reset form data if category prop changes (useful for editing)
    if (category) {
      setFormData({
        name: category.name,
        reference: category.reference,
        is_active: category.is_active,
      });
    }
  }, [category]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Hook to handle the create mutation
  const createProductCategory = useCreateProductCategory();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');

    try {
      if (category) {
        // Update existing category

        // await apiManage.products.categories.update(category.id, formData);
        setSuccessMessage("Categoria atualizada com sucesso!");
      } else {
        // Create new category
        createProductCategory.mutate(formData, {
          onSuccess: (data) => {
            setSuccessMessage(`Categoria criada com sucesso!`);
            setFormData({ name: '', reference: '', is_active: true });
            if (onSave) onSave(); // Callback after save
          },
          onError: (error) => {
            if ( error.status == 422 ) {
              setError("Essa categoria já existe!");
            } else {
              setError("Falha ao salvar a categoria. " + error.message);
              console.error("Erro salvando a categoria:", error);
            }
            }
        });
      }
    } catch (error) {
      setError("Falha ao salvar a categoria. " + error.message);
      console.error("Erro salvando a categoria:", error);
    }
  };

  return (
    <div>
      <h2>{category ? 'Editar categoria' : 'Criar nova categoria'}</h2>
      {error && <Feedback type='error'>{error}</Feedback>}
      {successMessage && <Feedback type='success'>{successMessage}</Feedback>}
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Referência:
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Ativa:
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">{category ? 'Atualizar' : 'Criar nova'}</button>
      </form>
    </div>
  );
};

export default CategoryForm;
