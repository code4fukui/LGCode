export const querySPARQL = async (endPoint, query) => {
  const headers = { Accept: "application/sparql-results+json" };
  //console.log(query);
  const url = endPoint + "?query=" + encodeURIComponent(query);
  //console.log(url);
  const debug = true;
  if (debug) {
    const res = await fetch(url);
    const txt = await res.text();
    return txt;
  }
  //return await res.json();
  return JSON.parse(txt);
};
