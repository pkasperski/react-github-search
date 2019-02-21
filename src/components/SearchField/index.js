// @flow

import React, { useState } from "react";

type Props = {
  onChange: (value: string) => void
};

const SearchField = (props: Props) => {
  const [searchValue, setSearchValue] = useState("");

  const { onChange } = props;

  const handleOnChange = event => {
    const { value } = event.target;

    setSearchValue(value);
    onChange(value);
  };

  return (
    <input
      type="text"
      value={searchValue}
      name="search_field"
      onChange={handleOnChange}
      placeholder="Please type your query"
    />
  );
};

export default SearchField;
