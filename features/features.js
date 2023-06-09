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

    const removeUndefinedQuery = ["search", "limit", "page"];
    removeUndefinedQuery.map((item) => delete queries[item]);

    let queryStr = JSON.stringify(queries);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  };

	pagination = (perPage) => {
		 const currentPage = Number(this.queryStr.page) || 1;
		 const skip = perPage * (currentPage - 1);

		 this.query = this.query.limit(perPage).skip(skip);
		 return this;
	}
}

module.exports = Features;
