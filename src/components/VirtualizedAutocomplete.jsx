import React, { useRef, useEffect, createContext, forwardRef } from "react";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Popper from "@mui/material/Popper";
import { VariableSizeList } from "react-window";
import { styled } from "@mui/material/styles";

const LISTBOX_PADDING = 8; // px

const OuterElementContext = createContext({});

const OuterElementType = forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

const ListboxComponent = forwardRef(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData = React.Children.toArray(children);
  const itemCount = itemData.length;
  const itemSize = 40;

  const getHeight = () => {
    return Math.min(8, itemCount) * itemSize;
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={() => itemSize}
          overscanCount={5}
          itemCount={itemCount}
        >
          {({ index, style }) =>
            React.cloneElement(itemData[index], {
              style: {
                ...style,
                top: style.top + LISTBOX_PADDING,
              },
            })
          }
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

export default function VirtualizedAutocomplete({
  options,
  value,
  onChange,
  getOptionLabel,
  label,
  noOptionsText,
  variant = "standard", // mặc định
  size = "small",      // thêm size mặc định
}) {
  return (
    <Autocomplete
      disableListWrap
      options={options}
      value={value}
      onChange={onChange}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => (
        <TextField {...params} label={label} variant={variant} size={size} sx={{ fontSize: 12 }} />
      )}
      PopperComponent={StyledPopper}
      ListboxComponent={ListboxComponent}
      noOptionsText={noOptionsText}
    />
  );
}
