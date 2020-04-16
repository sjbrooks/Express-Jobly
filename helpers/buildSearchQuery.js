/**
 * Generate a selective SQL query based on request body
 * 
 * 
 * 
 * 
 */

 function sqlForSearchQuery(search, min_employees, max_employees){
    let query = 'SELECT handle, name FROM companies'; 
    let values = [];
    let addQuery = ' WHERE ';

    if (!search && !min_employees && !max_employees){
        return query;
    }

    if(search){
    addQuery.concat('(lower(name) LIKE $1 OR lower(handle) LIKE $1)')
    }

num_employees BETWEEN

    // if(search && !min_employees && !max_employees){
    //     addQuery = ` WHERE (lower(name) LIKE $1 OR lower(handle) LIKE $1)`
    //     values.push(search);
    //     query = query.concat(addQuery);
    //     return {query, values};
    //  }

    //  if(search && min_employees && !max_employees){
    //     let addQuery = `WHERE (lower(name) LIKE $1 OR lower(handle) LIKE $1)`
    //     values.push(search);
    //     query = query.concat(addQuery);
    //     return {query, values};
    //  }






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
  let query = `UPDATE ${table} SET ${cols} WHERE ${key}=$${idx} RETURNING ${colNames}`; // changed from * to ${columnNames}, wanted to return JUST what was changed, not everything for security concerns

  let values = Object.values(items);
  values.push(id);

  // only creates query, doesn't send it
  // we should use this in the models?
  return { query, values };
}

module.exports = sqlForSearchQuery;
