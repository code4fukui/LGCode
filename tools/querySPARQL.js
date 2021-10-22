const debug = true;

export const querySPARQL = async (endPoint, query) => {
  const headers = { Accept: "application/sparql-results+json" };
  console.log(query);
  //Deno.exit(1);
  const url = endPoint + "?query=" + encodeURIComponent(query);
  //console.log(url);
  const res = await fetch(url, headers);
  if (debug) {
    const txt = await res.text();
    return JSON.parse(txt);
  } else {
    return await res.json();
  }
};
