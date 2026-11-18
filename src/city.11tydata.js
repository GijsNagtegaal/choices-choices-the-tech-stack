export default {
  eleventyComputed: {
    permalink: ({ pagination }) => `/${pagination.items[0].slug}/map/index.html`,
    title: ({ pagination }) => pagination.items[0].name,
    description: ({ pagination }) =>
      `Air quality information for ${pagination.items[0].name}.`
  }
};
