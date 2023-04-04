export const getHubspotAttributes = (attrs, callback) => {
  let attributes = "";
  attrs.forEach((attr) => {
    attributes += `&attrs=${attr}`;
  });
};
