import { useNavigate } from '@shopify/app-bridge-react';
import { 
    IndexTable, 
    Link, 
    Text, 
    Badge 
} from '@shopify/polaris';


import capitalizeFirstLetter from '../utils/capitalizeFirstLetter';
import OrdersTableFilter from './OrdersTableFilter';

function getPaymentStatusBadgeProps( payment_status ) {
    let badge_status = '';
    let badge_progress = '';
    switch ( payment_status ) {
        case 'PENDING':
            badge_status = 'warning';
            badge_progress = 'incomplete';
            break;
        case 'PAID':
            badge_progress = 'complete'
        default:
            break;
    }

    return {
        status: badge_status,
        progress: badge_progress
    };
}

function getFulfillmentStatusBadgeProps( payment_status ) {
    let badge_status = '';
    let badge_progress = '';
    switch ( payment_status ) {
        case 'UNFULFILLED':
            badge_status = 'attention';
            badge_progress = 'incomplete';
            break;
        default:
            break;
    }

    return {
        status: badge_status,
        progress: badge_progress
    };
}

function formatStatus( str ) {
    return capitalizeFirstLetter( str.toLowerCase().replace('_', ' '));
}

export default function OrdersTable( { orders, productTags, productTagsSelectedOptions, handleProductTagsSelectedChange } ) {

    const navigate = useNavigate();

    const resourceName = {
        singular: 'order',
        plural: 'orders'
    }

    const rowsMarkup = orders.length ? orders.map( ( order, index ) => {

        const price = order.totalPriceSet.shopMoney;
        const payment_status = order.displayFinancialStatus;
        const payment_status_formatted = formatStatus( payment_status );

        const fulfillment_status = order.displayFulfillmentStatus;
        const fulfillment_status_formatted = formatStatus( fulfillment_status );

        let payment_status_badge_props = getPaymentStatusBadgeProps( payment_status );
        let fulfillment_status_badge_props = getFulfillmentStatusBadgeProps( fulfillment_status );

        return (
            <IndexTable.Row
                id={ order.id }
                key={ order.id }
                position={ index }
                
                disabled={ false }
            >
                <IndexTable.Cell>
                    <Link
                        onClick={ () => { 
                            navigate( {
                                name: 'Order', 
                                resource: {
                                    id: order.legacyResourceId
                                }
                            } )
                        } }
                    >
                        { order.name }
                    </Link>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    { 
                        new Date(order.createdAt).toLocaleDateString('en-us', {
                            weekday: 'long',
                            hour: 'numeric',
                            minute: 'numeric'
                        }) 
                    }
                </IndexTable.Cell>
                <IndexTable.Cell>
                    { order.customer ?
                        order.customer.firstName + ' ' + order.customer.lastName
                    :
                        <Text color='subdued'>
                            No customer
                        </Text>
                    }
                </IndexTable.Cell>
                <IndexTable.Cell>
                    { `${ price.currencyCode } ${ price.amount }` }
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Badge { ...payment_status_badge_props } >{ payment_status_formatted }</Badge>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Badge { ...fulfillment_status_badge_props } >{ fulfillment_status_formatted }</Badge>
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
                    { title: 'Order' },
                    { title: 'Date' },
                    { title: 'Customer' },
                    { title: 'Total' },
                    { title: 'Payment status' },
                    { title: 'Fulfillment status' },
                    { title: 'Items' },
                    { title: 'Delivery method' },
                    { title: 'Tags' },
                ] }
                selectable={ false }
            >
                { rowsMarkup }
            </IndexTable>
        </>
        
    )
}