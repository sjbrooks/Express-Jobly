const db = require("../db")
const express = require("express")
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const sqlForSearchQuery = require("../helpers/buildSearchQuery");

/** Jobs model */
class Job {
    
    /**Job.get
     * Get all jobs that meet query parameter
     * 
     * takes {search, min_salary, max_salary}
     * returns {jobs:[{job}, ...]}
     */
    
    static async get(data) {
        let baseQuery = "SELECT id, title, company_handle FROM jobs";
        let whereExpressions = [];
        let queryValues = [];
        
        // For each possible search term, add to whereExpressions and
        // queryValues so we can generate the right SQL
        
        if (data.min_salary) {
            queryValues.push(+data.min_employees);
            whereExpressions.push(`min_salary >= $${queryValues.length}`);
        }
        
        if (data.max_equity) {
            queryValues.push(+data.max_employees);
            whereExpressions.push(`min_equity >= $${queryValues.length}`);
        }
        
        if (data.search) {
            queryValues.push(`%${data.search}%`);
            whereExpressions.push(`title LIKE $${queryValues.length}`);
        }
        
        if (whereExpressions.length > 0) {
            baseQuery += " WHERE ";
        }
        
        // Finalize query and return results
        
        let finalQuery = baseQuery + whereExpressions.join(" AND ");
        console.log(`\n\n\n The value of finalQuery is `, finalQuery);
        console.log(`\n\n\n The value of queryValues is `, queryValues);
        const jobsRes = await db.query(finalQuery, queryValues);
        console.log(`\n\n\n The value of jobsRes is `, jobsRes);
        return jobsRes.rows;
    }
    
    
    /**  Job.create
     * This should create a new Job
     * and return the newly created Job.
     * 
     * takes { id, title, salary, equity, company_handle}
     * returns jobData = {id, title, company_handle, date_posted}
     */
    
    static async create({ id, title, salary, equity, company_handle }) {
        const result = await db.query(`
        INSERT INTO jobs (
            title,
            salary, 
            equity, 
            company_handle
            )
            VALUES (
                $1, $2, $3, $4
                )
                RETURNING id, title, company_handle, date_posted`,
                [title, salary, equity, company_handle]);
                
                let jobData = result.rows[0];
                return jobData;
            }
            
            /**
             *  Job.byHandle()
             */
        }
        
        
        
        module.exports = Job;