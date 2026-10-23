#!/usr/bin/env node

// Supported operations: addition, subtraction, multiplication, division,
// modulo, exponentiation (power), and square root.
const operations = {
  add: (left, right) => left + right,
  subtract: (left, right) => left - right,
  multiply: (left, right) => left * right,
  divide: (left, right) => {
    if (right === 0) {
      throw new Error("Division by zero is not allowed.");
    }

    return left / right;
  },
  modulo: (left, right) => {
    if (right === 0) {
      throw new Error("Modulo by zero is not allowed.");
    }

    return left % right;
  },
  power: (base, exponent) => base ** exponent,
  squareRoot: (number) => {
    if (number < 0) {
      throw new Error("Square root of a negative number is not allowed.");
    }

    return Math.sqrt(number);
  },
};

function main(args) {
  const [operation, leftInput, rightInput] = args;
  const isUnaryOperation = operation === "squareRoot";
  const expectedArgumentCount = isUnaryOperation ? 2 : 3;

  if (
    args.length !== expectedArgumentCount ||
    !Object.hasOwn(operations, operation)
  ) {
    throw new Error(
      "Usage: node src/calculator.js <add|subtract|multiply|divide|modulo|power> <number> <number> or node src/calculator.js squareRoot <number>",
    );
  }

  const left = Number(leftInput);
  const right = isUnaryOperation ? undefined : Number(rightInput);

  if (
    !Number.isFinite(left) ||
    (right !== undefined && !Number.isFinite(right))
  ) {
    throw new Error("All operands must be finite numbers.");
  }

  console.log(
    isUnaryOperation
      ? operations[operation](left)
      : operations[operation](left, right),
  );
}

if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = operations;
