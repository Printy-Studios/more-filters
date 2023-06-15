import { useNavigate } from '@shopify/app-bridge-react';
import { IndexTable } from '@shopify/polaris';
import OrdersTableFilter from './OrdersTableFilter';

export default function OrdersTable( { orders, productTags, productTagsSelectedOptions, handleProductTagsSelectedChange } ) {

    const navigate = useNavigate();

    const resourceName = {
        singular: 'order',
        plural: 'orders'
    }

    const rowsMarkup = orders.length ? orders.map( ( order, index ) => {
        return (
            <IndexTable.Row
                id={ order.id }
                key={ order.id }
                position={ index }
                onClick={ () => { 
                    navigate( {
                        name: 'Order', 
                        resource: {
                            id: order.legacyResourceId
                        }
                    } )
                } }
            >
                <IndexTable.Cell>
                    { order.name }
                </IndexTable.Cell>
            </IndexTable.Row>
        );
    } ) : '';

    return (
        <>
            <OrdersTableFilter
                productTags={ productTags }
                productTagsSelectedOptions={ productTagsSelectedOptions }
                handleProductTagsSelectedChange={ handleProductTagsSelectedChange }
            />
            <IndexTable
                resourceName={ resourceName }
                itemCount={ orders.length }
                headings={ [
                    { title: 'Order' }
                ] }
            >
                { rowsMarkup }
            </IndexTable>
        </>
        
    )
}