import FirecrawlApp from "@mendable/firecrawl-js";

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export async function scrapeProduct(url) {
  const doc = await firecrawl.scrape(url, {
    formats: ["markdown", "html"],
  });

  const meta = doc.metadata || {};

  const productName = meta["og:title"] || meta.title || null;

  let currentPrice = null;
  let currencyCode = "INR";

  if (Array.isArray(meta["product:price:amount"])) {
    currentPrice = Number(meta["product:price:amount"][0]);
  }

  if (!currentPrice && doc.markdown) {
    const match = doc.markdown.match(/₹\s?([\d,]+)/);
    if (match) {
      currentPrice = Number(match[1].replace(/,/g, ""));
    }
  }

  const productImageUrl =
    meta.ogImage ||
    (Array.isArray(meta["og:image"]) ? meta["og:image"][0] : null);

  if (
    !productName ||
    productName === "/" ||
    !currentPrice ||
    currentPrice <= 0
  ) {
    throw new Error("Blocked or non-product page");
  }

  return {
    productName,
    currentPrice,
    currencyCode,
    productImageUrl,
  };
}
