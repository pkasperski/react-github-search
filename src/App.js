import React, { useState, useReducer, useEffect } from "react";
import debounce from "lodash.debounce";
import SearchField from "./components/SearchField";
import SearchResults from "./components/SearchResults";
import API from "./api";
import "./App.css";

const initialState = {
  searchTerm: "",
  sortBy: "full_name",
  orderBy: "desc",
  perPage: 10,
  page: 1,
  loadingResults: false,
  error: null,
  query: {
    repositoryName: "",
    sortBy: "full_name",
    orderBy: "desc",
    perPage: 10,
    page: 1
  }
};

function reducer(state, action) {
  switch (action.type) {
    case "build_search_query":
      return {
        ...state,
        query: {
          ...action.value
        }
      };
    case "search_for_repository":
      return {
        ...state,
        searchTerm: action.value.trim()
      };
    case "sort_by":
      return {
        ...state,
        sortBy: action.value.trim()
      };
    case "order_by":
      return {
        ...state,
        orderBy: action.value.trim()
      };
    case "page_limit":
      return {
        ...state,
        perPage: action.value
      };
    case "error":
      return {
        ...state,
        error: action.value
      };
    default:
      return state;
  }
}

const App = () => {
  const [loadingResults, setLoadingResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    buildSearchQuery();
  }, [state.searchTerm, state.sortBy, state.orderBy, state.perPage]);

  useEffect(() => {
    if (state.searchTerm) {
      fetchResults();
    }
  }, [state.query]);

  const buildSearchQuery = () => {
    dispatch({
      type: "build_search_query",
      value: {
        ...state.query,
        repositoryName: state.searchTerm,
        sortBy: state.sortBy,
        orderBy: state.orderBy,
        perPage: state.perPage
      }
    });
  };

  const fetchResults = async () => {
    setLoadingResults(true);

    const results = await API.getRepositiories(state.query);

    setLoadingResults(false);

    if (results.errorStatus) {
      return dispatch({ type: "error", value: results.errorStatus });
    }

    setSearchResults(results);
  };

  const searchTermFieldHandler = term => {
    dispatch({
      type: "search_for_repository",
      value: term.trim()
    });
  };

  const shouldDisplayNotfound = !searchResults.length && !state.error;
  const shouldDisplayList = Boolean(searchResults.length) && !state.error;

  function handleResults() {
    return (
      <React.Fragment>
        {shouldDisplayNotfound && <SearchResultsNothingFound />}
        {state.error && <SearchResultsError errorCode={state.error} />}
        {shouldDisplayList && (
          <SearchResults
            searchResults={searchResults}
            pageLimit={state.perPage}
            dispatch={dispatch}
          />
        )}
      </React.Fragment>
    );
  }

  return (
    <div className="App">
      <h1>Search for repositories:</h1>
      <SearchField onChange={debounce(searchTermFieldHandler, 500)} />
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
