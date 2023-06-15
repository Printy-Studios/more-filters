import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text,
  Button,
} from "@shopify/polaris";
import { TitleBar, useAuthenticatedFetch } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";

import { trophyImage } from "../assets";

import { ProductsCard } from "../components";
import OrdersTable from '../components/OrdersTable';
import { useState } from 'react';
import { useEffect } from 'react';

export default function HomePage() {
  const { t } = useTranslation();
  const fetch = useAuthenticatedFetch();

  const [ orders, setOrders ] = useState( [] );
  const [ allProductTags, setAllProductTags ] = useState( [] );
  const [ productTagsSelectedOptions, setProductTagsSelectedOptions ] = useState( [] );

  const fetchOrders = async () => {
    const response = await fetch( 'api/orders' );
    const data = await response.json();
    console.log(data);
    setOrders( data );
  }

  const fetchProductTags = async () => {
    const response = await fetch( 'api/products/tags' );
    const data = await response.json();
    setAllProductTags( data );
  }

  const fetchProducts = async (options) => {
    let query_params = [];

    console.log('before')
    if ( 'tags' in options && Array.isArray( options.tags ) ) {
      console.log('tags: ', options.tags);
      query_params.push( 'tags=' + options.tags.join( ',' ) );
    }
    console.log('after');
    
    //const tags = ['tag1', 'tag2'];
    const response = await fetch( 'api/products?' + query_params.join( '&' ) );
    const data = await response.json();
    console.log( 'products:', data );
  }

  useEffect(async () => {
    fetchOrders();
    fetchProductTags();
    fetchProducts();
  }, []);

  const handleProductTagsSelectedChange = ( selected_options ) => {
    setProductTagsSelectedOptions( selected_options );

    //fetchProducts

    console.log('now selected tags: ', selected_options);
  }

  useEffect(() => {
    console.log('changed state');
    fetchProducts( { tags: productTagsSelectedOptions } );
  }, [ productTagsSelectedOptions ] )

  return (
    <Page narrowWidth>
      <TitleBar title={t("HomePage.title")} primaryAction={null} />
      <Layout>
        <Layout.Section>
          <Button
            onClick={ () => fetchOrders() }
          >
            Fetch orders
          </Button>
          <Button
            onClick={ () => fetchProductTags() }
          >
            Fetch Product Tags
          </Button>
          <Button
            onClick={ () => fetchProducts() }
          >
            Fetch Products
          </Button>
          <OrdersTable 
            orders={ orders }
            productTags={ allProductTags }
            handleProductTagsSelectedChange={ handleProductTagsSelectedChange }
            productTagsSelectedOptions={ productTagsSelectedOptions }
          />
        </Layout.Section>
        <Layout.Section>
          <ProductsCard />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
