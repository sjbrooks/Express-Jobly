const express = require("express");
const router = new express.Router();
const ExpressError = require("../helpers/expressError");
const Job = require("../models/job");
const { NOT_FOUND, BAD_REQUEST, UNAUTHORIZED } = require("../httpStatusCodes");
const jsonschema = require("jsonschema");


/**  GET /jobs {search, min_salary, max_salary}  
 * => {jobs: [jobData, ...]} */

router.get("/", async function (req, res, next) {
    try {
    //   let { search, min_salary, max_salary } = req.query;
      const jobs = await Job.get(req.query);
  
      if (jobs.length === 0) throw new ExpressError("No jobs found", NOT_FOUND);
  
      return res.json({ jobs })
  
    } catch (err) {
      return next(err);
    }
  })


// routes


module.exports = router; 