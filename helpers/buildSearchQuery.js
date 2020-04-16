/**
 * Generate a selective SQL query based on request body
 * 
 * 
 * 
 * 
 */


function sqlForSearchQuery(search, min_employees, max_employees) {
  let idx = 1;
  let query = 'SELECT handle, name FROM companies';
  let values = [];
  let addQuery = ' WHERE ';

  function buildMinMaxQueryLine(min_employees, max_employees) {

    console.log("\n\n\n\n Made it into buildminmaxqueryline")

    let minMaxQueryLine;

    console.log("\n\n\n\n min_employees in buildminmaxqueryline before reassignment is", min_employees)
    min_employees = min_employees || 0;
    console.log("\n\n\n\n min_employees in buildminmaxqueryline after reassignment is", min_employees)
    max_employees = max_employees || 100000000;

    minMaxQueryLine = (`(num_employees BETWEEN $${idx} AND $${idx + 1})`);
    console.log("\n\n\n\n minMaxQueryLine in buildminmaxqueryline is", minMaxQueryLine)
    return minMaxQueryLine;
  }

  if (!search && !min_employees && !max_employees) {
    return { query, values };
  }

  if (search) {
    addQuery += (`(lower(name) LIKE $${idx} OR lower(handle) LIKE $${idx})`);
    idx++;
    values.push(`%${search.toLowerCase()}%`);

    console.log("addQuery is inside search before nested if is ", addQuery)

    if (min_employees || max_employees) {
      let minMaxQueryLine = buildMinMaxQueryLine(min_employees, max_employees);
      addQuery += (' AND ' + minMaxQueryLine);
      console.log("addQuery is inside search insde nested if is ", addQuery)
      query += addQuery;

      values.push(min_employees, max_employees);

      return { query, values }
    }

    query += addQuery;
    console.log("THE VALUES INSIDE SEARCH", values)
    return { query, values }
    
  }
  
  // if (search && (min_employees || max_employees)) {
    //   query += ' AND ';
    // }
    
    if (min_employees || max_employees) {
      let minMaxQueryLine = buildMinMaxQueryLine(min_employees, max_employees);
      addQuery += minMaxQueryLine;
      query += addQuery;
      
      values.push(min_employees, max_employees);
      
      console.log("THE VALUES INSIDE MIN MAX", values)
    return { query, values }
  }
}




module.exports = sqlForSearchQuery;
