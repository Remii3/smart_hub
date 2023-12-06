import { Label } from '@components/UI/label';
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
        searchParams.append('author', actionMeta.option.authorInfo.pseudonim);
        setSearchParams(searchParams, { replace: true });
        break;
      }
      case 'remove-value': {
        const authors = searchParams
          .getAll('author')
          .filter(
            (item) => item !== actionMeta.removedValue.authorInfo.pseudonim
          );
        searchParams.delete('author');
        if (authors) {
          authors.forEach((item) => searchParams.append('author', item));
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
  return (
    <>
      <Select
        menuPlacement="top"
        maxMenuHeight={250}
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
        isMulti
        inputId="filterAuthors"
        options={authorsState.options}
        onChange={(newValue, actionMeta) => selectHandler(actionMeta)}
        getOptionValue={(author) => author.authorInfo.pseudonim}
        getOptionLabel={(author) => author.authorInfo.pseudonim}
        value={
          searchParams.getAll('author').length <= 0
            ? null
            : searchParams.getAll('author').map((item) => {
                return {
                  label: item,
                  value: item,
                  authorInfo: { pseudonim: item },
                };
              })
        }
      />
    </>
  );
}
