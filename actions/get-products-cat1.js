export const getProductsCat1 = async () => {
  const URL =
    process.env.NEXT_APP_API_URL +
    "/api/products?populate=*&filters[$and][0][home_category][title][$eq]=Produktet më të shitura";

  const res = await fetch(URL, {
    headers: {
      Authorization: "Bearer " + process.env.NEXT_APP_API_TOKEN,
    },
  });

  return res.json();
};
