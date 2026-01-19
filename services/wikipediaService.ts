/**
 * Fetches a relevant image from Wikipedia based on a query.
 * Uses a search-first approach to handle inexact queries (e.g., "ak47" -> "AK-47").
 */
export const fetchWikipediaImage = async (query: string): Promise<string | null> => {
  try {
    // Step 1: Search for the most relevant page title
    const searchParams = new URLSearchParams({
      action: 'query',
      list: 'search',
      srsearch: query,
      format: 'json',
      origin: '*',
      srlimit: '1'
    });

    const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?${searchParams.toString()}`);
    const searchData = await searchRes.json();

    if (!searchData.query?.search?.length) {
      return null;
    }

    const title = searchData.query.search[0].title;

    // Step 2: Fetch the image for the specific page title found
    const imageParams = new URLSearchParams({
      action: 'query',
      format: 'json',
      prop: 'pageimages',
      titles: title,
      pithumbsize: '1000', // Request a high-res thumbnail if original is tricky
      piprop: 'original|thumbnail',
      origin: '*'
    });

    const imageRes = await fetch(`https://en.wikipedia.org/w/api.php?${imageParams.toString()}`);
    const imageData = await imageRes.json();

    const pages = imageData?.query?.pages;
    if (!pages) return null;

    const pageId = Object.keys(pages)[0];
    if (pageId === '-1') return null;

    const page = pages[pageId];

    // Prefer original source, fallback to large thumbnail
    if (page.original?.source) {
      return page.original.source;
    }
    if (page.thumbnail?.source) {
      return page.thumbnail.source;
    }

    return null;
  } catch (error) {
    console.error("Error fetching Wikipedia image:", error);
    return null;
  }
};