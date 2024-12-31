const BASE_URL = process.env.NEXT_PUBLIC_WORDPRESS_REST_URL;
const CONSUMER_KEY = process.env.WOOCOM_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOM_CONSUMER_SECRET_KEY;

export const WOOCOM_REST_GET_ALL_PRODUCTS = (page = 1, perPage = 12) =>
  `${BASE_URL}products?per_page=${perPage}&page=${page}&consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

export const WOOCOM_REST_GET_PRODUCT_BY_ID = (id: string) =>
  `${BASE_URL}products/${id}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

export const WOOCOM_REST_GET_PRODUCT_BY_SLUG = (slug: string) =>
  `${BASE_URL}products?slug=${slug}&consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

export const WOOCOM_REST_GET_ALL_PRODUCT_SLUGS = (page = 1, perPage = 100) =>
  `${BASE_URL}products?per_page=${perPage}&page=${page}&consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
