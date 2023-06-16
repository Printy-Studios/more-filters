export default function ProductsPopover() {

    const [ popoverActive, setPopoverActive ] = useState( false );

    return (
        <Popover
            active={ itemsPopoverActive }
            activator={
                <Button
                    disclosure
                    fullWidth
                    onClick={ () => setPopoverActive( ! popoverActive ) }
                >
                    { order.lineItems.length } Item{ order.lineItems.length > 1 && 's'}
                </Button>
            }
        >
            <ResourceList>
                
            </ResourceList>
        </Popover>
    )
}