import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core/';
import { highlight, languages } from 'prismjs/components/prism-core';
import Button from 'components/common/Button';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-json';

import '../codeEditorStyles/style.css';
import '../codeEditorStyles/prism.css';

type Props = {
  handleSubmit: (script: string) => void;
  defaultScript?: string;
  language?: string;
  submitWithButtonOnly?: boolean;
};
const SqlEditor: React.FC<Props> = ({ handleSubmit, defaultScript, language, submitWithButtonOnly = true }) => {
  const classes = useStyles();
  const [code, setCode] = useState(getExampleScriptForGivenLanguage(language) as string);
  const [error, setError] = useState('');

  useEffect(() => {
    if (defaultScript) {
      setCode(defaultScript);
    }
  }, [defaultScript]);

  const handleChange = (text: string) => {
    if (error && text) {
      setError('');
    }
    setCode(text);

    if (!submitWithButtonOnly && text) {
      handleSubmit(text);
    }
  };
  const handleSubmitClick = () => {
    if (code) {
      handleSubmit(code);
    } else {
      setError('Script is required!');
    }
  };
  return (
    <div className={classes.container}>
      <Editor
        className="box"
        value={code}
        onValueChange={(text: string) => handleChange(text)}
        highlight={codeScript => highlight(codeScript, getLanguageToEdit(language))}
        padding={20}
      />
      <Typography className={classes.errorLabel}>{error || null}</Typography>
      {submitWithButtonOnly && (
        <Button
          rootStyle={{ display: 'inline-block', float: 'right', margin: '10px 0px' }}
          variant="contained"
          color="primary"
          onClick={() => handleSubmitClick()}
          type="submit"
          size="xs"
        >
          Submit
        </Button>
      )}
    </div>
  );
};

export default SqlEditor;

const useStyles = makeStyles(() => ({
  container: {
    tabSize: '4ch',
    maxHeight: 400,
    overflow: 'auto',
    margin: 0,
    border: '2px solid #eee',
    padding: 30
  },
  errorLabel: {
    fontSize: 14,
    color: '#f44336',
    marginTop: 5
  }
}));

const getLanguageToEdit = (language: string = 'sql') => {
  switch (language) {
    case 'json':
      return languages.json;
    default:
      return languages.sql;
  }
};

const getExampleScriptForGivenLanguage = (language: string = 'sql') => {
  switch (language) {
    case 'json':
      return `{"key": "value"}`;
    default:
      return `-- SELECT * FROM users; -- get all users`;
  }
};
