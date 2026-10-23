const test = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const { add, subtract, multiply, divide } = require("../calculator");

test("addition supports the image example and common numeric inputs", async (t) => {
  await t.test("adds the example operands", () => {
    assert.equal(add(2, 3), 5);
  });

  await t.test("adds negative and decimal numbers", () => {
    assert.equal(add(-2, 3.5), 1.5);
  });

  await t.test("adds zero", () => {
    assert.equal(add(0, 0), 0);
  });
});

test("subtraction supports the image example and common numeric inputs", async (t) => {
  await t.test("subtracts the example operands", () => {
    assert.equal(subtract(10, 4), 6);
  });

  await t.test("subtracts negative and decimal numbers", () => {
    assert.equal(subtract(-2, 3.5), -5.5);
  });

  await t.test("subtracts zero", () => {
    assert.equal(subtract(0, 0), 0);
  });
});

test("multiplication supports the image example and common numeric inputs", async (t) => {
  await t.test("multiplies the example operands", () => {
    assert.equal(multiply(45, 2), 90);
  });

  await t.test("multiplies negative and decimal numbers", () => {
    assert.equal(multiply(-2, 3.5), -7);
  });

  await t.test("multiplication by zero returns zero", () => {
    assert.equal(multiply(45, 0), 0);
  });
});

test("division supports the image example and common numeric inputs", async (t) => {
  await t.test("divides the example operands", () => {
    assert.equal(divide(20, 5), 4);
  });

  await t.test("divides negative and decimal numbers", () => {
    assert.equal(divide(-7, 2), -3.5);
  });

  await t.test("zero divided by a nonzero number returns zero", () => {
    assert.equal(divide(0, 5), 0);
  });

  await t.test("division by zero throws a clear error", () => {
    assert.throws(() => divide(20, 0), {
      message: "Division by zero is not allowed.",
    });
  });
});

test("CLI evaluates each basic operation", async (t) => {
  const calculatorPath = path.join(__dirname, "..", "calculator.js");
  const cases = [
    ["add", "2", "3", "5"],
    ["subtract", "10", "4", "6"],
    ["multiply", "45", "2", "90"],
    ["divide", "20", "5", "4"],
  ];

  for (const [operation, left, right, expected] of cases) {
    await t.test(`${operation} ${left} and ${right}`, () => {
      const result = spawnSync(
        process.execPath,
        [calculatorPath, operation, left, right],
        { encoding: "utf8" },
      );

      assert.equal(result.status, 0);
      assert.equal(result.stdout.trim(), expected);
      assert.equal(result.stderr, "");
    });
  }
});

test("CLI reports invalid arguments and division by zero", async (t) => {
  const calculatorPath = path.join(__dirname, "..", "calculator.js");

  await t.test("rejects an unknown operation", () => {
    const result = spawnSync(
      process.execPath,
      [calculatorPath, "power", "2", "3"],
      { encoding: "utf8" },
    );

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Usage:/);
  });

  await t.test("rejects non-numeric operands", () => {
    const result = spawnSync(
      process.execPath,
      [calculatorPath, "add", "nope", "3"],
      { encoding: "utf8" },
    );

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /finite numbers/);
  });

  await t.test("reports division by zero", () => {
    const result = spawnSync(
      process.execPath,
      [calculatorPath, "divide", "20", "0"],
      { encoding: "utf8" },
    );

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Division by zero is not allowed/);
  });
});
