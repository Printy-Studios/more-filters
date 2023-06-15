//Core
import { useCallback, useState } from 'react';
import { IndexFilters, IndexFiltersMode, useSetIndexFiltersMode } from '@shopify/polaris';

//Components
import ProductTagsCombobox from './ProductTagsCombobox';


export default function OrdersTableFilter( { productTags, productTagsSelectedOptions, handleProductTagsSelectedChange } ) {

    const { mode, setMode } = useSetIndexFiltersMode( IndexFiltersMode.Filtering );

    const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

    const sortOptions = [
        {label: 'Order', value: 'order asc', directionLabel: 'Ascending'},
        {label: 'Order', value: 'order desc', directionLabel: 'Descending'},
    ]

    
    

    const [ sortSelected, setSortSelected ] = useState( sortOptions[0].value );
    const [ queryValue, setQueryValue ] = useState( undefined );
    const [ selected, setSelected ] = useState( 0 );
    const [ itemStrings, setItemStrings ] = useState([
        'All'
    ])

    const [ productTag, setProductTag ] = useState( [] );
    //const [ productTagsSelectedOptions, setProductTagsSelectedOptions] = useState( [] );

    const productTagsOptions = productTags.map(tag => {
        return {
            label: tag,
            value: tag
        }
    })

    // const handleProductTagsSelectedChange = ( selectedOptions ) => {
    //     props.handleProductTagsSelectedChange( selectedOptions );
    //     //setProductTagsSelectedOptions( selectedOptions );
    //     console.log( 'Now selected: ', selectedOptions );
    // }

    const tabs = itemStrings.map( ( item, index ) => ( {
        content: item,
        index,
        onAction: () => {},
        id: `${ item }-${ index }`,
        isLocked: index == 0,
        actions: index == 0 ? [] : [
            {
                type: 'rename',
                onAction: () => {},
                onPrimaryAction: async ( value ) => {
                    const newItemStrings = tabs.map( ( item, idx ) => {
                        if ( idx == index ) {
                            return value;
                        }
                        return item.content;
                    });
                    await sleep( 1 );
                    setItemStrings( newItemStrings );
                    return true;
                }
            },
            {
                type: 'duplicate',
                onPrimaryAction: async ( value ) => {
                    await sleep( 1 );
                    duplicateView( value );
                    return true;
                }
            },
            {
                type: 'edit'
            },
            {
                type: 'delete',
                onPrimaryAction: async () => {
                    await sleep( 1 );
                    deleteView( index );
                    return true;
                }
            }
        ]
    } ) );

    const filters = [
        {
            key: 'product_tag',
            label: 'Product tag',
            filter: (
                <ProductTagsCombobox
                    options={ productTagsOptions }
                    selectedOptions={ productTagsSelectedOptions }
                    onChange={ handleProductTagsSelectedChange }
                />
            ),
            shortcut: true
        }
    ];

    const appliedFilters = [];

    const deleteView = async ( index ) => {
        const newItemStrings = [ ...itemStrings ];
        newItemStrings.splice( index, 1 );
        setItemStrings( newItemStrings );
        setSelected( 0 );
    };

    const duplicateView = async ( name ) => {
        setItemStrings( [ ...itemStrings, name ] );
        setSelected( itemStrings.length );
        await sleep( 1 );
        return true;
    }



    const handleQueryValueChange = useCallback( value => setQueryValue( value ), [] );

    const handleProductTagRemove = useCallback( () => {

        console.log('removing tag');
        handleProductTagsSelectedChange( [] );

        //setProductTag([])
    } , []);

    const handleFiltersClearAll = useCallback( () => {
        console.log('removing');
        handleProductTagRemove();
    }, [ handleProductTagRemove ] );

    const onCreateNewView = async ( value ) => {
        await sleep(500);
        setItemStrings( [ ...itemStrings, value ] );
        setSelected( itemStrings.length );
        return true;
    };

    const onHandleCancel = () => {};

    const primaryAction = selected == 0 ?
        {
            type: 'save-as',
            onAction: onCreateNewView,
            disabled: false,
            loading: false,
        } :
        {
            type: 'save',
            onAction: onHandleSave,
            disabled: false,
            loading: false,
        }

    return (
        <IndexFilters
            sortOptions={ sortOptions }
            sortSelected={ sortSelected }
            queryValue={ queryValue }
            queryPlaceholder='Searching in all'
            onQueryChange={ handleQueryValueChange }
            onQueryClear={ () => {} }
            onSort={ setSortSelected }
            primaryAction={ primaryAction }
            cancelAction={ {
                onAction: onHandleCancel,
                disabled: false,
                loading: false
            } }
            tabs={ tabs }
            selected={ selected }
            onSelect={ setSelected }
            canCreateNewView
            onCreateNewView={ onCreateNewView }
            filters={ filters }
            appliedFilters={ appliedFilters }
            onClearAll={ handleFiltersClearAll }
            mode={ mode }
            setMode={ setMode }
        />
    )
}