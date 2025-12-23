import FirecrawlApp from "@mendable/firecrawl-js";

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

// export async function scrapeProduct(url) {
//   try {
//     const result = await firecrawl.scrapeUrl(url, {
//       render: "browser",
//       waitFor: 3000,
//       timeout: 20000,

//       formats: ["extract"],
//       extract: {
//         prompt: `
// Extract product details ONLY if this is a real product page.
// If price is missing, zero, or page is not a product page, return null.
//         `,
//         schema: {
//           type: "object",
//           properties: {
//             productName: { type: "string" },
//             currentPrice: { type: "number" },
//             currencyCode: { type: "string" },
//             productImageUrl: { type: "string" },
//           },
//         },
//       },
//     });

//     const data = result?.extract;

//     // 🔒 strict validation
//     if (
//       !data ||
//       !data.productName ||
//       data.productName === "/" ||
//       !data.currentPrice ||
//       data.currentPrice <= 0
//     ) {
//       throw new Error("Blocked or non-product page");
//     }

//     return data;
//   } catch (error) {
//     console.error("Firecrawl scrape error:", error);
//     throw new Error(
//       "Unable to fetch product details. This website may block scraping."
//     );
//   }
// }

export async function scrapeProduct(url) {
  const doc = await firecrawl.scrape(url, {
    formats: ["markdown", "html"],
  });

  const meta = doc.metadata || {};

  // ---------- productName ----------
  const productName =
    meta["og:title"] ||
    meta.title ||
    null;

  // ---------- currentPrice ----------
  let currentPrice = null;
  let currencyCode = "INR"; // default (Shopify / India)

  // Shopify metadata price
  if (Array.isArray(meta["product:price:amount"])) {
    currentPrice = Number(meta["product:price:amount"][0]);
  }

  // Fallback: extract ₹ price from text
  if (!currentPrice && doc.markdown) {
    const match = doc.markdown.match(/₹\s?([\d,]+)/);
    if (match) {
      currentPrice = Number(match[1].replace(/,/g, ""));
    }
  }

  // ---------- productImageUrl ----------
  const productImageUrl =
    meta.ogImage ||
    (Array.isArray(meta["og:image"]) ? meta["og:image"][0] : null);

  // ---------- strict validation (same as commented code) ----------
  if (
    !productName ||
    productName === "/" ||
    !currentPrice ||
    currentPrice <= 0
  ) {
    throw new Error("Blocked or non-product page");
  }

  // ✅ FINAL OUTPUT (matches commented schema)
  return {
    productName,
    currentPrice,
    currencyCode,
    productImageUrl,
  };
}
