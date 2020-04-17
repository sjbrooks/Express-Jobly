/**
 * Generate a selective SQL query based on request body
 * 
 * 
 * 
 * 
 */

function sqlForSearchQuery(search, min_value, max_value) {
  let query = 'SELECT handle, name FROM companies';
  let values = [];
  let addQuery = ' WHERE ';

  if (!search && !min_value && !max_value) {
    return { query, values };
  }

  if (search) {
    addQuery += ('(lower(name) LIKE $1 OR lower(handle) LIKE $1)');
    console.log("\n\n\n\n addQuery inside of if(search) inside buildSerachQuery BEFORE nested if block is ", addQuery);

    values.push(`%${search.toLowerCase()}%`);

    if (min_value || max_value) {
      min_value = min_value || 0;
      max_value = max_value || 100000000;

      addQuery += (' AND (num_employees BETWEEN $2 AND $3)');
      query += addQuery;
      values.push(min_value, max_value);
      return { query, values }
    }

    console.log("\n\n\n\n addQuery inside of if(search) inside buildSerachQuery is ", addQuery);
    query += (addQuery);
    return { query, values }
  }

  if (min_value || max_value) {
    min_value = min_value || 0;
    max_value = max_value || 100000000;

    addQuery += (' (num_employees BETWEEN $1 AND $2)');
    query += (addQuery);
    values.push(min_value, max_value);
    return { query, values }
  }
}


module.exports = sqlForSearchQuery;
