export default async function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "src/css": "css",
    "src/images": "images"
  });

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "_site"
    }
  };
};