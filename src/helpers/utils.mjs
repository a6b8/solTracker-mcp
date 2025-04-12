import { z } from 'zod'
import axios from 'axios'


function createZodSchema( { arrayOfParamObjects } ) {
    const result = arrayOfParamObjects
        .reduce( ( acc, item ) => {
            let { paramName, description, paramType, required, enumList } = item
            if( paramType === 'float' ) { paramType = 'number' }
            if( paramType === 'int' ) { paramType = 'number' }
            if( paramType === 'integer' ) { paramType = 'number' }
            if( paramType === 'bool' ) { paramType = 'boolean' }

            let schema
            switch( paramType ) {
                case 'number':
                    schema = z.number()
                    break
                case 'string':
                    if( Array.isArray( enumList ) && enumList.length > 0 ) {
                        schema = z.enum( [ ...enumList ] )
                    } else {
                        schema = z.string()
                    }
                    break
                case 'boolean':
                    schema = z.boolean()
                    break;
                case 'array': 
                    schema = z.array( z.string() )
                    break;
                default:
                    console.warn( '> Unknown type:', paramType )
                    schema = z.any()
            }
        
            schema.describe( description )
            if( !required ) { schema = schema.optional() }
            acc[ paramName ] = schema

            return acc
        }, {} )

    return result 
}


async function executeGetData( { requestMethod, url, headers, body } ) {
    let struct = {
        'status': true,
        'messages': [],
        'data': null,
    }

    switch( requestMethod.toUpperCase() ) {
        case 'GET':
            try {
                const response = await axios.get( url, { headers } )
                const { data } = response
                struct['data'] = data
            } catch( e ) {
                struct['status'] = false
                struct['messages'].push( e.message )
            }
            break;
        case 'POST':
            try {
                const response = await axios.post( url, body, { headers } )
                const { data } = response
                struct['data'] = data
            } catch( e ) {
                struct['status'] = false
                struct['messages'].push( e.message )
            }

            break;
        default:
            struct['status'] = false
            struct['messages'].push( 'Unknown method:', requestMethod )
            console.warn('Unknown method:', requestMethod )
    }

    return struct
}


export { createZodSchema, executeGetData }