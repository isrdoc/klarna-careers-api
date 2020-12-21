import { fetch } from 'cross-fetch'
import { print } from 'graphql'

export default function makeRemoteExecutor({ url }) {
  return async ({ document, variables }) => {
    const query = typeof document === 'string' ? document : print(document)

    const fetchResult = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    })

    return fetchResult.json()
  }
}
