import React, { useState, useEffect } from 'react';
import { capitalize, isEmpty } from 'lodash';
import Grid from '@material-ui/core/Grid';
import { Fab, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Field from 'components/common/Field';

type Props = {
  maxOptions: number;
  inputFields: string[];
  onChange: (obj: any) => void;
  fieldMinWidth?: number | string;
  defaultValue?: any[];
};
const APIEndpointDynamicField: React.FC<Props> = ({
  maxOptions = 5,
  inputFields,
  onChange,
  fieldMinWidth,
  defaultValue = []
}) => {
  const [options, setOptions] = useState(['option-0']);
  const [inputObj, setInputObj] = useState({});

  useEffect(() => {
    if (defaultValue?.length && isEmpty(inputObj)) {
      const optionList = [];
      const inputObjectFormatted = {};
      for (let [i, each] of defaultValue?.entries()) {
        const option = `option-${i}`;
        optionList.push(option);
        inputObjectFormatted[option] = each;
      }
      setOptions(optionList);
      setInputObj(inputObjectFormatted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  const handleChange = e => {
    const { name, value } = e.target;
    const latestOption = options[options.length - 1];
    setInputObj({
      ...inputObj,
      [latestOption]: {
        ...inputObj[latestOption],
        [name]: value
      }
    });
    onChange(
      Object.values({
        ...inputObj,
        [latestOption]: {
          ...inputObj[latestOption],
          [name]: value
        }
      })
    );
  };

  const appendInput_option = () => {
    var newInput = `option-${options.length}`;
    setOptions([...options, newInput]);
  };

  return (
    <div>
      {options.map((option, index) => (
        <Grid key={option} container spacing={2} alignItems="center" justify="flex-start">
          {inputFields.map((fieldName, i) => {
            const label = capitalize(fieldName);
            const value = inputObj[option] ? inputObj[option][fieldName] : '';
            return (
              <Grid xs={12} sm={6} item key={fieldName}>
                <Field
                  placeholder={label}
                  name={fieldName}
                  onChange={handleChange}
                  size="small"
                  defaultValue={value || ''}
                  multiline
                  fullWidth
                />
              </Grid>
            );
          })}

          {index + 1 === options.length && index + 1 < maxOptions && (
            <Grid xs="auto" item style={{ paddingTop: index === 0 ? 38 : 12 }}>
              <Tooltip title="Add more row" placement="top">
                <Fab color="primary" size="small" onClick={appendInput_option}>
                  <AddIcon />
                </Fab>
              </Tooltip>
            </Grid>
          )}
        </Grid>
      ))}
    </div>
  );
};

export default APIEndpointDynamicField;
