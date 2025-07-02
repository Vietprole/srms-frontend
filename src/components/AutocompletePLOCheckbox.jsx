import * as React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import useAutocomplete from '@mui/material/useAutocomplete';

const InputWrapper = styled('div')({
  width: 300,
  border: '1px solid #ccc',
  borderRadius: 4,
  padding: '2px 4px',
  display: 'flex',
  flexWrap: 'wrap',
  '& input': {
    border: 'none',
    outline: 'none',
    flexGrow: 1,
    padding: 4,
  },
});

const StyledTag = styled('div')({
  display: 'flex',
  alignItems: 'center',
  padding: '2px 6px',
  margin: '2px',
  backgroundColor: '#e0f7fa',
  borderRadius: '4px',
  fontSize: 13,
  '& svg': {
    fontSize: 14,
    cursor: 'pointer',
    marginLeft: 4,
  },
});

const Listbox = styled('ul')({
  width: 300,
  margin: 0,
  padding: 0,
  listStyle: 'none',
  border: '1px solid #ccc',
  borderRadius: 4,
  maxHeight: 250,
  overflow: 'auto',
  backgroundColor: '#fff',
  zIndex: 10,
  position: 'absolute',
  '& li': {
    padding: '6px 12px',
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginLeft: 'auto',
      visibility: 'hidden',
    },
    '&[aria-selected="true"]': {
      backgroundColor: '#e6f7ff',
      fontWeight: 600,
      '& svg': {
        visibility: 'visible',
        color: '#1890ff',
      },
    },
  },
});

export default function AutocompletePLOCheckbox({ lsPLO, selectedPLOs, setSelectedPLOs }) {
  const {
    getRootProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    multiple: true,
    options: lsPLO,
    getOptionLabel: (option) => option.ten,
    value: lsPLO.filter((p) => selectedPLOs.includes(p.id)),
    onChange: (event, newValue) => {
      setSelectedPLOs(newValue.map((v) => v.id));
    },
  });

  return (
    <div {...getRootProps()}>
      <InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
        {value.map((option, index) => (
          <StyledTag key={index}>
            {option.ten}
            <CloseIcon
              fontSize="small"
              onClick={() => {
                const newList = value.filter((v) => v.id !== option.id);
                setSelectedPLOs(newList.map((v) => v.id));
              }}
            />
          </StyledTag>
        ))}
        <input {...getInputProps()} placeholder="Chọn PLO..." />
      </InputWrapper>
      {groupedOptions.length > 0 && (
        <Listbox {...getListboxProps()}>
          {groupedOptions.map((option, index) => {
            const { key, ...optionProps } = getOptionProps({ option, index });
            return (
              <li key={key} {...optionProps}>
                {option.ten}
                <CheckIcon fontSize="small" />
              </li>
            );
          })}
        </Listbox>
      )}
    </div>
  );
}
