export default function ResourceLink() {
    return (
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
    )
}