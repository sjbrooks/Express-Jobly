process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../../app");
const db = require("../../db");

const Company = require("../../models/user");




// put test here




afterAll(async function () {
    await db.end();
  });