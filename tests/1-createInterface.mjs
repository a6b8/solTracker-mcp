import { createSolTrackerTools } from './../src/task/solTracker.mjs'
import { endpoints } from './../src/data/endpoints.mjs'

const name = 'trendingTokens'
const item = endpoints[ name ]
const userParams = item['example']
createSolTrackerTools( null )