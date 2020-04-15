const db = require("../../db");
const sqlForPartialUpdate = require("../../helpers/partialUpdate");

process.env.NODE_ENV = "test";


let CompHandleT1;
describe("partialUpdate()", () => {

  beforeEach(
    async function() {
      await db.query(`delete from jobs`);
      await db.query(`delete from companies`);
      CompHandleT1 = await db.query(`INSERT into companies
    (handle, name, num_employees, description, logo_url)
    VALUES ('FicInc', 
      'PretendCo', 
      456, 
      'pretends to fix the world''s problems', 
      'https://res.cloudinary.com/teepublic/image/private/s--RCdOAK-K--/t_Resized%20Artwork/c_fit,g_north_west,h_1054,w_1054/co_ffffff,e_outline:53/co_ffffff,e_outline:inner_fill:53/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_jpg,h_630,q_90,w_630/v1539852739/production/designs/3341218_0.jpg')
    RETURNING handle
      `)
    }
)

  it("should generate a proper partial update query with just 2 fields",  //originally written test asked for 1 field
    async function () {

      // // FIXME: write real tests!
      // expect(false).toEqual(true);
      let items = {
        name: "Larry Inc",
        num_employees: 876543
      };

      let c = await sqlForPartialUpdate('companies', items, 'handle', 'FicInc')
      let {query, values} = c;
      // console.log(query);
      // console.log(values);
      expect(query).toEqual("UPDATE companies SET name=$1, num_employees=$2 WHERE handle=$3 RETURNING name, num_employees, handle");
      expect(values).toEqual([ 'Larry Inc', 876543, 'FicInc' ]);
      
      //attempted to test for if update happened
      // why doesn't testRes run/update?
      // SQL for the updated company
      // let testRes = await db.query(query, values);
      // console.log(testRes);

      // expect(testRes.rows[0].name).toBe("Larry Inc");
      // expect(testRes.rows[0].num_employees).toBe(876543);
      // expect(testRes.rows[0].handle).toBe('FicInc');

      // WHY NOT? add test using getCompany() to see if company is updated
    });

});

afterAll(async function () {
  await db.end();
});