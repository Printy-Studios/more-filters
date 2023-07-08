import { useNavigate } from '@shopify/app-bridge-react';
import { useState } from 'react';
import { Popover, Button, ResourceList, ResourceItem } from '@shopify/polaris';

export default function ProductsPopover( { products, label } ) {

    const navigate = useNavigate();

    const [ popoverActive, setPopoverActive ] = useState( false );

    console.log('popover products: ', products);

    return (
        <Popover
            active={ popoverActive }
            activator={
                <Button
                    disclosure
                    fullWidth
                    onClick={ () => setPopoverActive( ! popoverActive ) }
                >
                    { label }
                </Button>
            }
            onClose={ () => setPopoverActive( false ) }
        >
            {Array.isArray( products ) && products.length &&
                <ResourceList
                    resourceName={ { singular: 'product', plural: 'products'}}
                    items={ products }
                    renderItem={ ( item ) => {
                        return (
                            <ResourceItem
                                onClick={ () => { 
                                    navigate( {
                                        name: 'Product', 
                                        resource: {
                                            id: item.product.legacyResourceId
                                        }
                                    } )
                                } }
                            >
                                { item.name }{ item.currentQuantity > 1 && '(' + item.currentQuantity + ')' }
                            </ResourceItem>
                        )
                    } }
                />
            }
        </Popover>
    )
}