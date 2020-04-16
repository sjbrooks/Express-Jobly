process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../../app");
const db = require("../../db");

const Company = require("../../models/company");

let testCompany = {
  handle: "TestCo",
  name: "Test Company",
  num_employees: 10,
  description: "fake activities",
  logo_url: "https://test-image.com/"
};

let testCoHandle;

describe("Tests for companies routes", function () {

  beforeEach(async function () {
    await db.query(`delete from companies`);
    const company = await Company.create(testCompany);
    testCoHandle = company.handle;
  });

  describe("GET /companies", function () {
    it("Gets a list of all companies that meet query search", async function () {
      const resp = await request(app).get(`/companies`);

      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
        "companies": [
          {
            "handle": "TestCo",
            "name": "Test Company"
          }
        ]
      });
    });

    it("Gets an error message that no companies were found when nothing matches query search", async function () {
      const resp = await request(app).get(`/companies?min_employees=100`);

      expect(resp.body.status).toBe(404);
      expect(resp.body).toEqual({
        "status": 404,
        "message": "No companies found"
      });
    });
  });

  describe("GET /companies/:handle", function () {
    it("Get a single comapny by its handle", async function () {
      const resp = await request(app).get(`/companies/TestCo`);

      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
        "company":
        {
          "handle": "TestCo",
          "name": "Test Company"
        }
      });
    });

    it("Get no comapny when non-existing handle is passed in", async function () {
      const resp = await request(app).get(`/companies/NotFoundCo`);

      expect(resp.statusCode).toBe(404);
      expect(resp.body).toEqual({
        "status": 404,
        "message": "No company found"
      });
    });
  });

  describe("POST /companies", function () {
    it("Creates new company by posting to db", async function () {
      await db.query(`delete from companies`);

      const resp = await request(app).post('/companies').send(
        {
          "handle": "testing",
          "name": "testname",
          "num_employees": 1200000,
          "description": "nefarious and despicable environmental damage",
          "logo_url": "http://not-a-real-logo.edu"
        }
      );
      // QUESTION: how do we send a 201 status code?
      expect(resp.statusCode).toBe(201);
      expect(resp.body).toEqual({
        "company": {
          "handle": "testing",
          "name": "testname"
        }
      });

      // find new company "testing" in list of all companies
      const companies = await request(app).get('/companies');

      expect(companies.body).toEqual({
        "companies": [{
          "handle": "testing",
          "name": "testname"
        }]
      });

    });

    it("Cannot create new company because new handle already exists in db", async function () {
      const resp = await request(app).post('/companies').send(
        {
          "handle": "TestCo",
          "name": "testname",
          "num_employees": 1200000,
          "description": "nefarious and despicable environmental damage",
          "logo_url": "http://not-a-real-logo.edu"
        }
      );

      expect(resp.body).toEqual({
        "message": "duplicate key value violates unique constraint \"companies_pkey\""
      });
    });

    it("Cannot create new company because num_employees not of right data type", async function () {
      const resp = await request(app).post('/companies').send(
        {
          "handle": "anon",
          "name": "testname",
          "num_employees": "catscatscats",
          "description": "nefarious and despicable environmental damage",
          "logo_url": "http://not-a-real-logo.edu"
        }
      );

      expect(resp.body).toEqual({
        "status": 400,
        "message": [
          "instance.num_employees is not of a type(s) integer"
        ]
      });
    });

  })

  describe("PATCH /companies", function () {

    it("Updates company information for given columns", async function () {
      const resp = await request(app).patch('/companies/TestCo').send(
        {
          "table": "companies",
          "items": {
            "name": "Rithm School"
          }
        })
      
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toEqual({
        "company": {
          "name": "Rithm School",
          "handle": "TestCo"
        }
      });
    });

    it("Won't update company handle, primary key", async function () {
      const resp = await request(app).patch('/companies/TestCo').send(
        {
          "table": "companies",
          "items": {
            "handle": "Rithm School"
          }
        })

      expect(resp.statusCode).toBe(400);
      expect(resp.body).toEqual({
          "status": 400,
          "message": "Cannot change primary key 'handle' in request body"
      });
    });



  });

  describe("DELETE /companies", function() {
    it("Successfully deletes a company in db", async function(){
      const resp = await request(app).delete('/companies/TestCo');
      
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({"message": "Company deleted"})
    });
  
    it("Cannot delete non-existant company", async function(){
      const resp = await request(app).delete('/companies/ImaginaryLTD');
      
      expect(resp.statusCode).toBe(404);
      expect(resp.body).toEqual({
        "status": 404,
        "message": "No company found"
      })
    });
  });

});



afterAll(async function () {
  await db.end();
});