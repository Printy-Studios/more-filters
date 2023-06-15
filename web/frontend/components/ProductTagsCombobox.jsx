import { Combobox, VerticalStack, Icon, Listbox, List, Tag, HorizontalStack } from '@shopify/polaris';
import * as icons from '@shopify/polaris-icons';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';


export default function ProductTagsCombobox( props ) {

    // const deselectedOptions = useMemo( () => [
    //     { value: 'tag1', label: 'Tag 1' },
    //     { value: 'tag2', label: 'Tag 2' },
    //     { value: 'tag3', label: 'Tag 3' }
    // ], []);

    // const deselectedOptions = useMemo( () => props.options.filter( option => !props.selectedOptions.includes( option ) ) );

    const deselectedOptions = useMemo( () => props.options );

    console.log( deselectedOptions );

    //console.log('selected options in component on render', props.selectedOptions);

    const [ selectedOptions, setSelectedOptions ] = useState( props.selectedOptions || [] );
    const [ inputValue, setInputValue ] = useState('');
    const [ options, setOptions ] = useState( deselectedOptions );

    const updateText = useCallback( value => {
        setInputValue( value );

        if ( value == '' ) {
            setOptions( deselectedOptions );
            return;
        }

        const filterRegex = new RegExp( value, 'i' );

        const resultOptions = deselectedOptions.filter( option => option.label.match( filterRegex ) );

        setOptions( resultOptions );
    }, [ deselectedOptions ] );

    const updateSelection = useCallback( selected => {
        if ( selectedOptions.includes( selected ) ) {
            setSelectedOptions( selectedOptions.filter( option => option !== selected ) );
        } else {
            setSelectedOptions( [...selectedOptions, selected ] );
        }

        updateText( '' );
    }, [ selectedOptions, updateText ] );

    useEffect(() => {
        props.onChange( selectedOptions );
    }, [ selectedOptions ] );

    const removeTag = useCallback( tag => {
        const options = [ ...selectedOptions ];
        options.slice( options.indexOf( tag ), 1 );
        setSelectedOptions( options );
    }, [ selectedOptions ] );

    const tagsMarkup = selectedOptions.map( option => (
        <Tag
            key={ `option-${ option }` }
            onRemove={ () => removeTag( option ) }
        >
            { option }
        </Tag>
    ) );

    const optionsMarkup = options.length > 0 ? options.map( option => (
            <Listbox.Option
                key={ option.value }
                value={ option.value }
                selected={ selectedOptions.includes( option.value ) }

            >
                { option.label }
            </Listbox.Option>
    ) ) : null;

    return (
        <div style={ { height: '225px' } }>
            <Combobox
                allowMultiple
                activator={
                    <Combobox.TextField
                        prefix={ <Icon source={ icons.SearchMinor } />}
                        onChange={ updateText }
                        label='Search tags'
                        labelHidden
                        value={ inputValue }
                        placeholder='Search tags'
                    />
                }
            >
                { optionsMarkup ? 
                    <Listbox onSelect={ updateSelection }>{ optionsMarkup }</Listbox>
                : null }
            </Combobox>
            <HorizontalStack
                gap='1'
            >
                { tagsMarkup }
            </HorizontalStack>
        </div>
    )
}