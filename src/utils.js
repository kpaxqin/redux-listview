import uniq from 'lodash.uniq'
import omitBy from 'lodash.omitby'

export function makePath(path, query) {
  const basePath = path;

  const queryStr = query
    ? Object.keys(query)
      .map(k => `${k}=${query[k]}`)
      .join('&')
    : '';

  return `${basePath}?${queryStr}`;
}

export { uniq, omitBy }