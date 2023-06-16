//Core
import { useState } from 'react';
import { useNavigate } from '@shopify/app-bridge-react';
import { 
    IndexTable, 
    Link, 
    Text, 
    Badge,
    Button,
    Icon,
    Popover,
    ActionList
} from '@shopify/polaris';
import * as icons from '@shopify/polaris-icons';
import { useI18n, DateStyle } from '@shopify/react-i18n';

//Functions
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter';

//Components
import OrdersTableFilter from './OrdersTableFilter';


function getStatusBadgeData( status, mappings ) {
    const status_data = mappings.find( mapping => mapping.status == status );

    return status_data;
}

function getPaymentStatusBadgeData( payment_status ) {

    const mappings = [
        {
            status: 'PENDING',
            props: {
                status: 'warning',
                progress: 'incomplete'
            },
            message: 'Payment pending'
        }, 
        {
            status: 'PAID',
            props: {
                progress: 'complete'
            },
            message: 'Paid'
        }
    ];

    return getStatusBadgeData( payment_status, mappings );
}

function getFulfillmentStatusBadgeData( fulfillment_status ) {

    const mappings = [
        {
            status: 'FULFILLED',
            props: {
                progress: 'complete'
            },
            message: 'Fulfilled'
        },
        {
            status: 'UNFULFILLED',
            props: {
                status: 'attention',
                progress: 'incomplete'
            },
            message: 'Unfulfilled'
        },
        {
            status: 'PARTIALLY_FULFILLED',
            props: {
                status: 'warning',
                progress: 'partiallyComplete'
            },
            message: 'Partially fulfilled'
        }
    ]

    return getStatusBadgeData( fulfillment_status, mappings );

}

function formatStatus( str ) {
    return capitalizeFirstLetter( str.toLowerCase().replace('_', ' '));
}

export default function OrdersTable( { orders, productTags, productTagsSelectedOptions, handleProductTagsSelectedChange } ) {

    const navigate = useNavigate();
    const [ i18n ] = useI18n();

    const resourceName = {
        singular: 'order',
        plural: 'orders'
    }

    const rowsMarkup = orders.length ? orders.map( ( order, index ) => {

        const price = order.totalPriceSet.shopMoney;
        const payment_status = order.displayFinancialStatus;
        //const payment_status_formatted = formatStatus( payment_status );

        const fulfillment_status = order.displayFulfillmentStatus;
        // const fulfillment_status_formatted = formatStatus( fulfillment_status );

        let payment_status_badge_data = getPaymentStatusBadgeData( payment_status );
        let fulfillment_status_badge_data = getFulfillmentStatusBadgeData( fulfillment_status );

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
                        // #TODO: Add i18n formatted date
                        // i18n.formatDate(new Date(order.createdAt), {
                        //     style: DateStyle.Humanize
                        // })
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
                    {
                        i18n.formatCurrency( price.amount, {
                            currency: price.currencyCode,
                            form: 'short'
                        } )
                    }
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Badge { ...payment_status_badge_data.props } >{ payment_status_badge_data.message }</Badge>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Badge { ...fulfillment_status_badge_data.props } >{ fulfillment_status_badge_data.message }</Badge>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    {/* { order.lineItems.length } Item{ order.lineItems.length > 1 && 's'} */}
                    
                    
                </IndexTable.Cell>
            </IndexTable.Row>
        );
    } ) : '';

    return (
        <>  
        <div>
            
        </div>
            
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
                ] }
                selectable={ false }
            >
                { rowsMarkup }
            </IndexTable>
        </>
        
    )
}