import { Label } from '@components/UI/label';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import { useGetAccessDatabase } from '@hooks/useAaccessDatabase';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';

export default function CategoriesFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoriesState, setCategoriesState] = useState<{ options: any }>({
    options: [],
  });
  const fetchCategories = useCallback(async () => {
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.CATEGORY_ALL,
    });
    if (error) {
      return;
    }
    setCategoriesState((prevState) => {
      return { ...prevState, options: [...data] };
    });
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const selectHandler = (actionMeta: any) => {
    switch (actionMeta.action) {
      case 'select-option': {
        searchParams.append('category', actionMeta.option.value);
        setSearchParams(searchParams, { replace: true });
        break;
      }
      case 'remove-value': {
        const categories = searchParams
          .getAll('category')
          .filter((item) => item !== actionMeta.removedValue.value);
        searchParams.delete('category');
        if (categories) {
          categories.forEach((item) => searchParams.append('category', item));
        }
        setSearchParams(searchParams, { replace: true });
        break;
      }
      case 'clear': {
        searchParams.delete('category');
        setSearchParams(searchParams, { replace: true });
        break;
      }
      default:
        return;
    }
  };
  const defaultValue = searchParams.getAll('category').map((item) => {
    return { label: item, value: item };
  });

  return (
    <>
      <Select
        inputId="filterCategories"
        menuPlacement="top"
        className="shadow-sm"
        styles={{
          control: (base, state) => ({
            ...base,
            outline: state.isFocused ? '2px solid transparent' : '',
            outlineColor: state.isFocused
              ? 'hsl(215, 20.2%, 65.1%)'
              : 'transparent',
            outlineOffset: state.isFocused ? '0' : '',
            border: state.isFocused
              ? '1px hsl(214, 32%, 91%) solid'
              : '1px hsl(214, 32%, 91%) solid',
            '&:hover': {
              border: '1px var hsl(214, 30%, 95%) solid',
            },
            borderRadius: 'calc(var(--radius) - 2px)',
            padding: '',
            transition: 'none',
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? 'hsl(214, 30%, 95%)' : undefined,
            ':active': {
              backgroundColor: 'hsl(214, 30%, 95%)',
            },
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: 'hsl(214, 30%, 95%)',
            borderRadius: '0.75rem',
            paddingLeft: '2px',
          }),
          multiValueRemove: (base) => ({
            ...base,
            borderRadius: '0 0.75rem 0.75rem 0',
          }),
        }}
        maxMenuHeight={250}
        isMulti
        options={categoriesState.options}
        defaultValue={defaultValue && defaultValue}
        onChange={(newValue, actionMeta) => selectHandler(actionMeta)}
        value={
          searchParams.getAll('category').length <= 0
            ? null
            : searchParams.getAll('category').map((item) => {
                return { label: item, value: item };
              })
        }
      />
    </>
  );
}
