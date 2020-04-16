const express = require("express");
const router = new express.Router();
const ExpressError = require("../helpers/expressError");
const Company = require("../models/company");
const { NOT_FOUND, BAD_REQUEST, UNAUTHORIZED } = require("../httpStatusCodes");
const jsonschema = require("jsonschema");
const companyCreateSchema = require("../schemas/companycreate.json");
const companyPatchSchema = require("../schemas/company-patch.json");


/**  GET /companies {search, min_employees, max_employees}  
 * => {companies: [companyData, ...]} */

router.get("/", async function (req, res, next) {
  try {
    let { search, min_employees, max_employees } = req.query;
    const companies = await Company.get({ search, min_employees, max_employees });

    if (companies.length === 0) throw new ExpressError("No companies found", NOT_FOUND);

    return res.json({ companies })

  } catch (err) {
    return next(err);
  }
})


/**  POST /companies 
 * 
 * { handle, name, num_employees, description, logo_url }  
 * => {company: [companyData]} */

router.post("/", async function (req, res, next) {

  const result = jsonschema.validate(req.body, companyCreateSchema);

  if (!result.valid) {
    let listOfErrors = result.errors.map(e => e.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  }

  try {
    let { handle, name, num_employees, description, logo_url } = req.body;
    const company = await Company.create({ handle, name, num_employees, description, logo_url });
    return res.status(201).json({company});
  } catch (err) {
    return next (err);
  }
});


/**  GET /companies/:handle
 * 
   * This should return a single company found by its id.
   * 
   * {handle} => {company: companyData}
   */

router.get("/:handle", async function (req, res, next) {
  try {
    let { handle } = req.params;
    const company = await Company.getByHandle({ handle });
  
    if (!company) throw new ExpressError("No company found", NOT_FOUND);
    
    return res.json({ company })

  } catch (err) {
    return next(err);
  }
})


/**  PATCH /companies/:handle
 * This should update an existing company and return the updated company.
 * 
 * takes { table, items }
 * 
 * returns JSON of {company: companyData}
 */

router.patch("/:handle", async function (req, res, next) {

  const result = jsonschema.validate(req.body, companyPatchSchema);

  if (!result.valid) {
    let listOfErrors = result.errors.map(e => e.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  }

  let { handle } = req.params;
  let { table, items } = req.body;
  let key = "handle";
  let id = handle;

  if ("handle" in items) {
    let error = new ExpressError("Cannot change primary key 'handle' in request body", BAD_REQUEST)
    return next(error);
  }

  try {
    const company = await Company.update({ table, items, key, id });
    return res.json({ company });

  } catch (err) {
    return next (err)
  }
})


/**  DELETE /companies/:handle
   * This should remove a single company found by its handle.
   * 
   * takes {handle}
   * 
   * returns JSON of {message: "Company deleted"}
   */


router.delete("/:handle", async function (req, res, next) {
  try {
    let { handle } = req.params;
    const company = await Company.delete({ handle });

    if (!company) throw new ExpressError("No company found", NOT_FOUND);
    return res.json({ message: "Company deleted" });

  } catch (err) {
    return next(err);
  }
});



module.exports = router;