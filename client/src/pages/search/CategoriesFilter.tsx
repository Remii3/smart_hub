import { DATABASE_ENDPOINTS } from '@data/endpoints';
import { useGetAccessDatabase } from '@hooks/useAaccessDatabase';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Select, { MultiValue } from 'react-select';

export default function CategoriesFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoriesState, setCategoriesState] = useState<{ options: any }>({
    options: [],
  });
  const [menuOpen, setMenuOpen] = useState(false);

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

  const selectHandler = (newValue: any, actionMeta: any) => {
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
        break;
    }
  };
  const defaultValue = searchParams.getAll('category').map((item) => {
    return { label: item, value: item };
  });

  return (
    <div>
      <Select
        menuPlacement="top"
        maxMenuHeight={250}
        onMenuOpen={() => setMenuOpen(true)}
        onMenuClose={() => setMenuOpen(false)}
        isMulti
        options={categoriesState.options}
        defaultValue={defaultValue && defaultValue}
        onChange={(newValue, actionMeta) => selectHandler(newValue, actionMeta)}
        value={
          searchParams.getAll('category').length <= 0
            ? null
            : searchParams.getAll('category').map((item) => {
                return { label: item, value: item };
              })
        }
      />
    </div>
  );
}
