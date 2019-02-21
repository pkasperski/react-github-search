// @flow

import React from "react";
import moment from "moment";

import "./style.css";

type Props = {
  searchResults: Array<*>,
  sortBy: (value: string) => void
};

const limitOptions = [10, 25, 50, 100];

const SearchResults = (props: Props) => {
  const { searchResults, pageLimit, dispatch } = props;

  const sortHandler = fieldName => {
    dispatch({ type: "sort_by", value: fieldName });
  };

  const pageLimitHandler = event => {
    dispatch({ type: "page_limit", value: event.target.value });
  };

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => sortHandler("full_name")}>
            <span>Name</span>
          </th>
          <th onClick={() => sortHandler("owner")}>
            <span>Owner</span>
          </th>
          <th onClick={() => sortHandler("watchers_count")}>
            <span>Stars</span>
          </th>
          <th onClick={() => sortHandler("created_date")}>
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
      <tfoot>
        <tr>
          <td colSpan="4">
            <select value={pageLimit} onChange={pageLimitHandler}>
              {limitOptions.map(i => (
                <option key={i.toString()} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export default SearchResults;
