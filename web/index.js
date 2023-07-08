// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";

import * as util from 'util';
import cleanGraphqlResponse from './cleanGraphqlResponse.js';

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

const newClient = ( res ) => {
  //console.log( res.locals.shopify );
  return new shopify.api.clients.Graphql( { session: res.locals.shopify.session } );
}

function getOrderUrl( order_id, store_url ) {
  return 'https://' + store_url + '/admin/orders/' + order_id;
}

app.get( '/api/orders', async ( _req, res ) => {

  const client = newClient( res );

  const response = await client.query({
    data: `query {
      orders(first: 10) {
          edges{
            node {
              id
              legacyResourceId
              name
              createdAt
              customer {
                firstName,
                lastName
              }
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              displayFinancialStatus
              displayFulfillmentStatus
              lineItems(first: 5) {
                edges {
                  node {
                    id
                    name
                    currentQuantity
                    product {
                      legacyResourceId
                    }
                  }
                }
              }
            }
          }
      }
    }`
  } );

  // console.log(util.inspect(cleanGraphqlResponse(response.body.data), true, 10));
  let orders = cleanGraphqlResponse(response.body.data).orders;

  orders = orders.map( order => {
    let modified_order = order;
    modified_order.url = getOrderUrl(order.legacyResourceId, res.locals.shopify.session.shop);
    return modified_order;
  })

 // console.log(orders);
  

  // const orders = await shopify.api.rest.Order.all( {
  //   session: res.locals.shopify.session,
  //   fields: 'id, line_items, name'
  // } );

  res.status( 200 ).send( orders );
} );

app.get( '/api/products/tags', async ( _req, res ) => {

  //console.log('getting tags');

  const client = newClient( res );

  const response = await client.query({
    data: `{
      shop{
        productTags(first: 250){
          edges{
            cursor
            node
          }
        }
      }
    }`
  } );

  //console.log( util.inspect(response.body.data, true, 10) );

  //console.log( util.inspect( cleanGraphqlResponse(response.body.data).shop, true, 10) );

  const shop = cleanGraphqlResponse(response.body.data).shop;

  const tags = shop.productTags;

  res.status( 200 ).send( tags );
} );

app.get( '/api/products', async ( _req, res ) => {

  //console.log('query: ');
  //console.log(_req.query);

  let tags = [];
  if ( _req.query.tags ) {
    tags = _req.query.tags.split(',');
  }

  const client = newClient( res );

  const tag_query = tags.map( tag => `(tag:'${ tag }')`).join(' OR ');

  //console.log('tag query: ', tag_query);

  const response = await client.query({
    data: `query {
      products(first: 20, query: "${ tag_query }") {
        edges {
          node {
            id,
            tags
          }
        }
      }
    }`
  })

  const products = cleanGraphqlResponse(response.body.data).products;

  //console.log(products);

  res.status( 200 ).send( products );

});

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
