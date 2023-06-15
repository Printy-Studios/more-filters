/**
* Remove edges, node and __typename from graphql response
*
* @param {Object} input - The graphql response
* @returns {Object} Clean graphql response
*/
const cleanGraphqlResponse = function(input) {
    if (!input) return null

    const isPrimitiveType = (test) => {
        return test !== Object(test);
    };
    
    if (isPrimitiveType(input)) return input;

    const output = {}
    const isObject = obj => {
        return obj !== null && typeof obj === 'object' && !Array.isArray(obj)
    }

    Object.keys(input).forEach(key => {
        if (input[key] && input[key].edges) {
        output[key] = input[key].edges.map(edge =>
            cleanGraphqlResponse(edge.node)
        )
        } else if (isObject(input[key])) {
        output[key] = cleanGraphqlResponse(input[key])
        } else if (key !== '__typename') {
        output[key] = input[key]
        }
    })

    return output
}

export default cleanGraphqlResponse;