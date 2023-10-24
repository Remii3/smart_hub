import { DATABASE_ENDPOINTS } from '@data/endpoints';
import { useGetAccessDatabase } from '@hooks/useAaccessDatabase';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';

export default function AuthorsFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [authorsState, setAuthorsState] = useState<{ options: any }>({
    options: [],
  });
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_AUTHORS,
    });
    if (error) {
      return;
    }
    setAuthorsState((prevState) => {
      return { ...prevState, options: [...data] };
    });
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const selectHandler = (actionMeta: any) => {
    switch (actionMeta.action) {
      case 'select-option': {
        searchParams.append('author', actionMeta.option.value);
        setSearchParams(searchParams, { replace: true });
        break;
      }
      case 'remove-value': {
        const categories = searchParams
          .getAll('author')
          .filter((item) => item !== actionMeta.removedValue.value);
        searchParams.delete('author');
        if (categories) {
          categories.forEach((item) => searchParams.append('author', item));
        }
        setSearchParams(searchParams, { replace: true });
        break;
      }
      case 'clear': {
        searchParams.delete('author');
        setSearchParams(searchParams, { replace: true });
        break;
      }
      default:
        break;
    }
  };
  const defaultValue = searchParams.getAll('author').map((item) => {
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
        options={authorsState.options}
        defaultValue={defaultValue && defaultValue}
        onChange={(newValue, actionMeta) => selectHandler(actionMeta)}
        value={
          searchParams.getAll('author').length <= 0
            ? null
            : searchParams.getAll('author').map((item) => {
                return { label: item, value: item };
              })
        }
      />
    </div>
  );
}
