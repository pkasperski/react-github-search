// @flow

import axios from "axios";

type Query = {
  repositoryName: string,
  sortBy: string,
  orderBy: string,
  perPage: string,
  page: string
};

const API = {
  getRepositiories: async (query: Query) => {
    const {
      repositoryName,
      sortBy = "full_name",
      orderBy = "desc",
      perPage = 10,
      page = 1
    } = query;
    try {
      const { data: repositories } = await axios.get(
        `https://api.github.com/search/repositories?q=${repositoryName}&sort=${sortBy}&order=${orderBy}&per_page=${perPage}&page=${page}`
      );

      return repositories.items;
    } catch (error) {
      return { errorStatus: error.response.status };
    }
  }
};

export default API;
