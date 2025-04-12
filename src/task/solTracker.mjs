import { endpoints } from './../data/endpoints.mjs'
import { paramTypes } from './../data/paramTypes.mjs'


import { createZodSchema, executeGetData } from '../helpers/utils.mjs' 
import dotenv from 'dotenv'
dotenv.config()

const ROOT_URL = 'https://data.solanatracker.io'
const SOLTRACKER_API_KEY = process.env.SOLTRACKER_API_KEY


function prepareZodSchema( { item } ) {
    if (!item) {
        throw new Error('Item is undefined in prepareZodSchema');
    }

    const { inserts } = item
    const mergedInputs = {
        ...( item.query || {} ),
        ...( item.body || {} )
    }

    const a = Object
        .entries( mergedInputs )
    const b = inserts
        .map( ( paramName ) => [ paramName, true ] )
    const arrayOfParamObjects = [ ...a, ...b ]
        .map( ( [ paramName, required ] ) => {
            const struct = paramTypes[ paramName ]
            const { description, type: paramType, validation } = struct
            const enumList = validation?.[ paramName ]
            const result = { paramName, description, paramType, required, enumList }
            return result
        } )

    return { arrayOfParamObjects }
}


function prepareGetData( { userParams, item } ) {
    if (!item) {
        throw new Error('Item is undefined in prepareGetData');
    }

    const { inserts, route, requestMethod } = item

    const url = inserts
        .reduce( ( acc, paramKey, index, arr ) => {
            const paramValue = userParams[ paramKey ]
            acc = acc.replace( `{${paramKey}}`, paramValue )

            if( index === arr.length - 1 ) {
                if( !Object.hasOwn( item, 'query' ) ) { return acc }
                Object
                    .entries( item['query'] )
                    .reduce( ( abb, [ name, required ], index, _arr ) => {
                        if( required ) {
                            if( !Object.hasOwn( userParams, name ) ) { console.error( `Missing required parameter: ${name}` ) }
                        }
                        if( Object.hasOwn( userParams, name ) ) {
                            abb[ name ] = userParams[ name ]
                        }

                        if( index === arr.length - 1 ) {
                            if( Object.keys( abb ).length === 0 ) { return abb }
                            let str = ''
                            str += '?'
                            str += new URLSearchParams( abb ).toString()
                            acc += str
                        }

                        return abb
                    }, {} )
            }

            return acc
        }, `${ROOT_URL}${route}` )

    const headers = { 
        'x-api-key': SOLTRACKER_API_KEY
    }

    const body = Object
        .entries( userParams )
        .filter( ( [ key, value ] ) => {
            if( !Object.hasOwn( item, 'body' ) ) { return false }
            if( Object.hasOwn( item['body'], key ) ) { return true }
            return false
        } )
        .reduce( ( acc, [ key, value ] ) => { 
            acc[ key ] = value
            return acc
        }, {} )

    return { requestMethod, url, headers, body }
}


async function getData( { userParams, item } ) {
    if (!item) {
        throw new Error('Item is undefined in getData');
    }

    const { requestMethod, url, headers, body } = prepareGetData( { userParams, item } )
    const { status, messages, data } = await executeGetData( { requestMethod, url, headers, body } )

    return { status, messages, data }
}


async function createInterface( { server, name, item } ) {
    const { description } = item
    const { arrayOfParamObjects } = prepareZodSchema( { item } )
    const zodSchema = createZodSchema( { arrayOfParamObjects } )

    server.tool( 
        name, 
        description, 
        zodSchema, 
        async ( userParams ) => {
            const { status, messages, data } = await getData( { userParams, item } )

            if( status ) {
                return { content: [{ type: "text", text: JSON.stringify(data) }] }
            } else {
                return { content: [{ type: "text", text: `Error(s): ${messages.join(', ')}` }] }
            }
        } 
    )

    return true
}



function createSolTrackerTools( server ) {
    Object
        .entries( endpoints )
        .forEach( ( [ name, item ] ) => {
            createInterface( { server, item, name } )
        } )

    return true
}





export { createSolTrackerTools, getData }