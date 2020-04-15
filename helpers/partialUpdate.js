/**
 * Generate a selective update query based on a request body:
 *
 * - table: where to make the query
 * - items: an object with keys of columns you want to update and values with
 *          updated values
 * - key: the column that we query by (e.g. username, handle, id)
 * - id: current record ID
 *
 * Returns object containing a DB query as a string, and array of
 * string values to be updated
 *
 */

function sqlForPartialUpdate(table, items, key, id) {
  // keep track of item indexes
  // store all the columns we want to update and associate with vals

  let idx = 1;
  let columns = [];
  let columnNames = [];  // added

  // filter out keys that start with "_" -- we don't want these in DB
  for (let key in items) {
    if (key.startsWith("_")) {
      delete items[key];
    }
  }

  for (let column in items) {
    columns.push(`${column}=$${idx}`);
    columnNames.push(column);  // added
    idx += 1;
  }

  columnNames.push(key);

// example of columns ['username=$1', 'handle=$2', 'id=$3', 'phone=$3']
  // build query
  let cols = columns.join(", ");
  let colNames = columnNames.join(", ");  // added

  // cols looks like "username=$1, handle=$2, id=$3, phone=$3"
  let query = `UPDATE ${table} 
              SET ${cols} 
              WHERE ${key}=$${idx} 
              RETURNING ${colNames}`; // changed from * to ${columnNames}, wanted to return JUST what was changed, not everything for security concerns

  let values = Object.values(items);
  values.push(id);

  // only creates query, doesn't send it
  return { query, values };
}

module.exports = sqlForPartialUpdate;
