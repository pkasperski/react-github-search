import React, { useState } from "react";
import debounce from "lodash.debounce";
import SearchField from "./components/SearchField";
import SearchResults from "./components/SearchResults";
import API from "./api";
import "./App.css";

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("full_name");
  const [loadingResults, setLoadingResults] = useState(false);
  const [error, setError] = useState(null);

  const onChange = async term => {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) {
      return;
    }

    setLoadingResults(true);

    const results = await API.getRepositiories({
      repositoryName: trimmedTerm,
      sortBy
    });

    setLoadingResults(false);

    if (results.errorStatus) {
      return setError(results.errorStatus);
    }

    setSearchResults(results);
    setSearchTerm(trimmedTerm);
    setError(null);
  };

  const sortByHandler = type => async () => {
    const results = await API.getRepositiories({
      repositoryName: searchTerm,
      sortBy: type
    });

    if (results.errorStatus) {
      return setError(results.errorStatus);
    }

    setSearchResults(results);
    setSortBy(type);
    setError(null);
  };

  const shouldDisplayNotfound = !searchResults.length && !error;
  const shouldDisplayList = Boolean(searchResults.length) && !error;

  function handleResults() {
    return (
      <React.Fragment>
        {shouldDisplayNotfound && <SearchResultsNothingFound />}
        {error && <SearchResultsError errorCode={error} />}
        {shouldDisplayList && (
          <SearchResults searchResults={searchResults} sortBy={sortByHandler} />
        )}
      </React.Fragment>
    );
  }

  return (
    <div className="App">
      <h1>Search for repositories:</h1>
      <SearchField onChange={debounce(onChange, 500)} />
      {loadingResults ? <LoadingResults /> : handleResults()}
    </div>
  );
};
const SearchResultsNothingFound = () => (
  <div>Houston, we have found nothing!</div>
);

const SearchResultsError = props => (
  <div>Houston, we have a serious problem! Error code: {props.errorCode}</div>
);

const LoadingResults = props => <div>Loading results...</div>;

export default App;
