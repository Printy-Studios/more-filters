import { useState } from 'react';
import { Popover, Button, ResourceList, ResourceItem } from '@shopify/polaris';

export default function ProductsPopover( { products, label } ) {

    const [ popoverActive, setPopoverActive ] = useState( false );

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
                            <ResourceItem>
                                { item.name }{ item.currentQuantity > 1 && '(' + item.currentQuantity + ')' }
                            </ResourceItem>
                        )
                    } }
                />
            }
        </Popover>
    )
}