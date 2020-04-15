const express = require("express");
const router = new express.Router();
const ExpressError = require("../helpers/expressError");
const Company = require("../models/company");
const { NOT_FOUND, BAD_REQUEST, UNAUTHORIZED } = require("../httpStatusCodes")


/**  GET /companies {search, min_employees, max_employees}  => {companies: [companyData, ...]} */

router.get("/", async function (req, res, next) {
  try {
    
    let { search, min_employees, max_employees } = req.query;
    
    console.log("\n\n\n\n request.body is ", req.body);
    console.log("\n\n\n\n request.query is ", req.query);
    console.log("\n\n\n\n request.params is ", req.params);
    console.log("\n\n\n\n The search term is ", search);
    console.log("\n\n\n\n The min_employees is ", min_employees);
    console.log("\n\n\n\n The max_employees term is", max_employees);
    
    const companies = await Company.get({search, min_employees, max_employees});

    if (companies.length === 0) throw new ExpressError("No companies found", NOT_FOUND);

    return res.json({companies})

  } catch (err) {
    return next(err)
  }
})



module.exports = router;