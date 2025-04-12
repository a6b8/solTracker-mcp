

import { endpoints } from './../src/data/endpoints.mjs'
import { getData } from './../src/task/solTracker.mjs'


const item = endpoints[ 'trendingTokens' ]
const userParams = item['example']

const { status, messages, data } = await getData( { userParams, item } )
console.log( 'status:', status )
console.log( 'messages:', messages )
console.log( 'data', data )