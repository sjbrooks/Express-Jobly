const db = require("../db")
const express = require("express")
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const sqlForSearchQuery = require("../helpers/buildSearchQuery");
const { NOT_FOUND, BAD_REQUEST, UNAUTHORIZED } = require("../httpStatusCodes");

/** Company model */

class Company {

  /**  Company.get
   * Get all companies that meet the query parameters passed in
   * 
   * takes {search, min_employees, max_employees}  
   * returns [{companyData}, ...]
   */
  
  static async get({ search, min_employees, max_employees }) {
    let { query, values } = sqlForSearchQuery(search, min_employees, max_employees);

    const result = await db.query(query, values);

    let companies = result.rows;
    return companies;
  }


  /**  Company.create
   * This should create a new company
   * and return the newly created company.
   * 
   * takes { handle, name, num_employees, description, logo_url } 
   * returns {companyData}
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

    let companyData = result.rows[0];
    return companyData;
  }


  /**  Company.getByHandle
   * This should return a single company found by its id.
   * 
   * takes {handle}
   * 
   * returns {companyData}
   */

  static async getByHandle({ handle }) {
    const result = await db.query(
      `SELECT handle, name
        FROM companies
        WHERE handle = $1`,
      [handle]);

    let companyData = result.rows[0];
    return companyData;
  }


  /**  Company.update
   * This should update an existing company and return the updated company.
   * 
   * takes {table, items, key, id}
   * 
   * returns {companyData}
   */

  static async update({ table, items, key, id }) {
    let { query, values } = sqlForPartialUpdate(table, items, key, id);

    const result = await db.query(query, values);
    // const companyData = result.rows[0] can make the following 2 lines more readable
    if (!result.rows[0]) throw new ExpressError("No company found", NOT_FOUND);

    let companyData = result.rows[0];
    return companyData;
  }

  /**  Company.delete
   * This should remove a single company found by its handle.
   * 
   * takes {handle}
   * 
   * returns handle
   */

  static async delete({ handle }) {
    const result = await db.query(`
      DELETE
      FROM companies
      WHERE handle = $1
      RETURNING handle`,
      [handle]);

    let deletedCompany = result.rows[0];
    if (!deletedCompany) throw new ExpressError("No company found", NOT_FOUND);

    return deletedCompany;
  }
}


module.exports = Company;