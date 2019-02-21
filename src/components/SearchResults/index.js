// @flow

import React from "react";
import moment from "moment";

import "./style.css";

type Props = {
  searchResults: Array<*>,
  sortBy: (value: string) => void
};

const SearchResults = (props: Props) => {
  const { searchResults, sortBy } = props;

  return (
    <table>
      <thead>
        <tr>
          <th onClick={sortBy("full_name")}>
            <span>Name</span>
          </th>
          <th onClick={sortBy("owner")}>
            <span>Owner</span>
          </th>
          <th onClick={sortBy("watchers_count")}>
            <span>Stars</span>
          </th>
          <th onClick={sortBy("created_date")}>
            <span>Created at</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {searchResults.map((row, index) => (
          <tr key={index.toString()}>
            <td>{row.full_name}</td>
            <td>{row.owner.login}</td>
            <td>{row.watchers_count}</td>
            <td>{moment(row.created_at).format("YYYY-MM-DD")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SearchResults;
