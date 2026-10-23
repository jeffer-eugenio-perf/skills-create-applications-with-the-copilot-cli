const test = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const {
  add,
  subtract,
  multiply,
  divide,
  modulo,
  power,
  squareRoot,
} = require("../calculator");

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

test("modulo supports the image example and edge cases", async (t) => {
  await t.test("returns the remainder for the example operands", () => {
    assert.equal(modulo(5, 2), 1);
  });

  await t.test("supports negative and decimal operands", () => {
    assert.equal(modulo(-5, 2), -1);
    assert.equal(modulo(5.5, 2), 1.5);
  });

  await t.test("returns zero for evenly divisible operands", () => {
    assert.equal(modulo(6, 3), 0);
  });

  await t.test("throws when dividing by zero", () => {
    assert.throws(() => modulo(5, 0), {
      message: "Modulo by zero is not allowed.",
    });
  });
});

test("power supports the image example and edge cases", async (t) => {
  await t.test("raises the example base to its exponent", () => {
    assert.equal(power(2, 3), 8);
  });

  await t.test("supports zero and negative exponents", () => {
    assert.equal(power(5, 0), 1);
    assert.equal(power(2, -2), 0.25);
  });

  await t.test("supports negative bases and fractional exponents", () => {
    assert.equal(power(-2, 3), -8);
    assert.equal(power(9, 0.5), 3);
  });
});

test("square root supports the image example and edge cases", async (t) => {
  await t.test("returns the square root of the example number", () => {
    assert.equal(squareRoot(16), 4);
  });

  await t.test("supports zero and decimal results", () => {
    assert.equal(squareRoot(0), 0);
    assert.equal(squareRoot(2.25), 1.5);
  });

  await t.test("throws for a negative number", () => {
    assert.throws(() => squareRoot(-1), {
      message: "Square root of a negative number is not allowed.",
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

test("CLI evaluates each extended operation", async (t) => {
  const calculatorPath = path.join(__dirname, "..", "calculator.js");
  const cases = [
    ["modulo", "5", "2", "1"],
    ["power", "2", "3", "8"],
    ["squareRoot", "16", undefined, "4"],
  ];

  for (const [operation, left, right, expected] of cases) {
    await t.test(`${operation} ${left}${right ? ` and ${right}` : ""}`, () => {
      const args = right
        ? [calculatorPath, operation, left, right]
        : [calculatorPath, operation, left];
      const result = spawnSync(process.execPath, args, { encoding: "utf8" });

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
      [calculatorPath, "unknown", "2", "3"],
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

  await t.test("reports modulo by zero", () => {
    const result = spawnSync(
      process.execPath,
      [calculatorPath, "modulo", "5", "0"],
      { encoding: "utf8" },
    );

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Modulo by zero is not allowed/);
  });

  await t.test("reports a negative square root", () => {
    const result = spawnSync(
      process.execPath,
      [calculatorPath, "squareRoot", "-1"],
      { encoding: "utf8" },
    );

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Square root of a negative number/);
  });
});
