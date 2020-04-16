const db = require("../db")
const express = require("express")
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");

/** Company model */

class Company {

  /**  Company.get
   * Get all companies that meet the query parameters passed in
   * 
   * takes {search, min_employees, max_employees}  
   * returns JSON of {companies: [companyData, ...]}
   */

  static async get({ search = '%', min_employees = 0, max_employees = 100000000 }) {
    const result = await db.query(
      `SELECT handle, name
        FROM companies
        WHERE (lower(name) LIKE $1 OR lower(handle) LIKE $1)
        AND (num_employees BETWEEN $2 AND $3)`,
      [`%${search.toLowerCase()}%`, min_employees, max_employees]);
    
      return result.rows;
  }


  /**  Company.create
   * This should create a new company
   * and return the newly created company.
   * 
   * takes { handle, name, num_employees, description, logo_url } 
   * returns JOSN of {company: [companyData]}
   */

  static async create({ handle, name, num_employees, description, logo_url }) {
    const result = await db.query(`
     INSERT INTO companies (
       handle,
        name, 
        num_employees, 
        description, 
        logo_url)
      VALUES (
        $1, $2, $3, $4, $5
      )
      RETURNING handle, name`,
      [handle, name, num_employees, description, logo_url]);

    return result.rows[0];
  }
  
  
  /**  Company.getByHandle
   * This should return a single company found by its id.
   * 
   * takes {handle}
   * 
   * returns JSON of {company: companyData}
   */

  static async getByHandle({ handle }) {
    const result = await db.query(
      `SELECT handle, name
        FROM companies
        WHERE handle = $1`,
      [handle]);
    
      return result.rows[0];
  }


  /**  Company.update
   * This should update an existing company and return the updated company.
   * 
   * takes (table, items, key, id)
   * 
   * returns JSON of {company: companyData}
   */

  static async update({table, items, key, id}) {
    let {query, values} = sqlForPartialUpdate(table, items, key, id);
    
    const result = await db.query(query, values);

    return result.rows[0];
  }
  
  /**  Company.delete
   * This should remove a single company found by its handle.
   * 
   * takes {handle}
   * 
   * returns JSON of {message: "Company deleted"}
   */
  
  static async delete({ handle }) {
    const result = await db.query(`
      DELETE
      FROM companies
      WHERE handle = $1
      RETURNING handle`,
      [handle]);

      return result.rows[0];
    }
  }
    

module.exports = Company;