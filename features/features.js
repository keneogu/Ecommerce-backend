class Features {
  constructor(query, queryStr) {
    (this.query = query), (this.queryStr = queryStr);
  }

  search = () => {
    const search = this.queryStr.search
      ? {
          name: {
            $regex: this.queryStr.search,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...search });
    return this;
  };

	filter = () => {
		const queries = { ...this.queryStr };

		const removeUndefinedQuery = ['search', 'limit', 'page']
		removeUndefinedQuery.map(item => delete queries[item])


		this.query = this.query.find(queries);
		return this;
	}
}

module.exports = Features;
