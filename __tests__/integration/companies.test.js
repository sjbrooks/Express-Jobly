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
    await db.query(`delete from jobs`);
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

      expect(resp.body.status).toBe(404);
      expect(resp.body).toEqual({
        "status": 404,
        "message": "No company found"
      });
    });
  });


});


afterAll(async function () {
  await db.end();
});