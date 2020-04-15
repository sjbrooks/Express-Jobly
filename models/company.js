const db = require("../db")
const express = require("express")
const ExpressError = require("../helpers/expressError");

/** Company model */

class Company {

  /**  
   * Get all companies that meet the query parameters passed in
   * 
   * {search, min_employees, max_employees}  
   * => {companies: [companyData, ...]}
   */

  static async get({ search='%', min_employees=0, max_employees=100000000 }) {
    const result = await db.query(
      `SELECT handle, name
        FROM companies
        WHERE (lower(name) LIKE $1 OR lower(handle) LIKE $1)
        AND (num_employees BETWEEN $2 AND $3)`,
      [`%${search.toLowerCase()}%`, min_employees, max_employees]);
    return result.rows;
  }
  
  
  /** POST */


}


module.exports = Company;