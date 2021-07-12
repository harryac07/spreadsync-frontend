import React, { useState } from 'react';
import { toLower, truncate } from 'lodash';
import styled from 'styled-components';
import {
  Select,
  TextField,
  OutlinedInput,
  Checkbox,
  MenuItem,
  Grid,
  FormControlLabel,
  InputLabel,
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import Tooltip from 'components/common/Tooltip';

type OptionProps = {
  label: string;
  isSelected: boolean;
  isRequired: boolean;
  value: string;
};

type Props = {
  options: OptionProps[];
  onChange: (selectedValues: string[]) => void;
  fullWidth?: boolean;
  defaultLabel: string;
};

const MultiSelectDropdown: React.FC<Props> = ({ options, onChange, fullWidth = false, defaultLabel = 'Select' }) => {
  const classes = useStyles();

  const [selectedValues, setSelectedValues] = useState([]);
  const [openMenu, setOpenMenu] = React.useState(false);
  const [searchValue, setSearchValue] = useState('');

  const filterOptionsByKeyword = (array = []) => {
    return array.filter(({ label, value }) => {
      return toLower(value).includes(toLower(searchValue)) || toLower(label).includes(toLower(searchValue));
    });
  };

  const handleChange = ({ label, value, checked }) => {
    const values = new Set(selectedValues);
    if (checked) {
      values.add(value);
    } else {
      values.delete(value);
    }
    const valueList = Array.from(values);
    setSelectedValues(valueList);
    onChange(valueList);
  };

  const renderFormattedValue = (val) => {
    if (!val.includes(', ')) {
      return val;
    }
    return (
      <Tooltip arrow placement="top" title={val}>
        <div>
          {truncate(val, {
            length: 36,
          })}
        </div>
      </Tooltip>
    );
  };

  const formattedLabel = options
    .filter(({ value }) => selectedValues.includes(value))
    .map(({ label }) => label)
    ?.join(', ');

  return (
    <div>
      <TopLabel>{defaultLabel}</TopLabel>
      <StyledSelect
        extrasmall={true}
        value={formattedLabel || defaultLabel}
        renderValue={renderFormattedValue}
        open={openMenu}
        onOpen={() => {
          setOpenMenu(true);
        }}
        onClose={() => {
          setOpenMenu(false);
          setSearchValue('');
        }}
        MenuProps={{
          getContentAnchorEl: null,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          className: classes.menu,
          PaperProps: {
            elevation: 4,
            style: { maxHeight: 400 },
          },
        }}
        input={<StyledOutlinedInput fullWidth={fullWidth} />}
        classes={{ icon: classes.selectIcon, root: classes.select }}
      >
        <MenuItem
          className={classes.searchListItem}
          onClick={(event) => {
            event.stopPropagation();
            setOpenMenu(true);
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <TextField
            id="multi-select-search"
            label={searchValue ? '' : 'Search'}
            variant="outlined"
            fullWidth
            size="small"
            value={searchValue}
            autoComplete="off"
            InputLabelProps={{ shrink: false }}
            // className={classes.searchField}
            onChange={(e) => {
              e.stopPropagation();
              setSearchValue(e.target.value);
            }}
          />
        </MenuItem>
        {filterOptionsByKeyword(options).map((each) => {
          const { label, value, description } = each;
          const isSelected = selectedValues?.includes(value);
          return (
            <StyledMenuItem
              key={label + value}
              onClick={(event) => {
                event.stopPropagation();
                setOpenMenu(true);
              }}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <Grid container alignItems="center" justify="space-between">
                <Grid item xs="auto">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isSelected}
                        onChange={(e) =>
                          handleChange({
                            label,
                            value,
                            checked: e.target.checked,
                          })
                        }
                        name={label}
                        color="primary"
                      />
                    }
                    label={
                      <Tooltip arrow placement="right" title={description}>
                        <div>{label}</div>
                      </Tooltip>
                    }
                  />
                </Grid>
              </Grid>
            </StyledMenuItem>
          );
        })}
      </StyledSelect>
    </div>
  );
};

export default MultiSelectDropdown;

const useStyles = makeStyles(() => ({
  menu: {
    marginTop: 10,
  },
  selectIcon: {
    marginRight: 8,
  },
  searchField: {
    marginBottom: 16,
    '& input': {
      borderRadius: '4px',
      padding: 8,
    },
    '& .MuiInputLabel-outlined': {
      color: '#898989',
      fontSize: 12,
      paddingTop: 2,
    },
  },
  focused: {},
  select: {
    padding: '12px 14px',
  },
  searchListItem: {
    paddingLeft: 8,
    paddingRight: 8,
    background: '#fff !important',
  },
}));
const StyledMenuItem = withStyles(() => ({
  root: {
    minWidth: 170,
    width: 'auto',
    height: 32,
    color: '#3F3F3F',
    fontSize: 14,
    margin: '8px 8px',
    padding: '6px 8px',
    '&.Mui-selected': {
      background: '#F9F9F9',
      border: '1px solid #E1E1E1',
      borderRadius: 4,
    },
  },
}))(MenuItem);

const StyledSelect = styled(Select)`
  height: ${(props) => (props.extrasmall === 'true' ? '40px' : 'inherit')};
`;
const StyledOutlinedInput = styled(OutlinedInput)`
  font-size: ${(props) => (props.extrasmall === 'true' ? '18px !important' : 'none')};
`;
const TopLabel = styled.div`
  margin: 0px 0px 5px 0px;
  padding: 0;
  font-size: 16px;
`;
