const createSearchURL = (baseUrl, params) => {
  const newSearchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === null) {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, value);
    }
  });

  return newSearchParams.toString() ? `${baseUrl}?${newSearchParams.toString()}` : baseUrl;
};

export { createSearchURL };
