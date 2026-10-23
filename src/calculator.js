#!/usr/bin/env node

// Supported operations: addition, subtraction, multiplication, and division.
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
};

function main(args) {
  const [operation, leftInput, rightInput] = args;

  if (args.length !== 3 || !Object.hasOwn(operations, operation)) {
    throw new Error(
      "Usage: node src/calculator.js <add|subtract|multiply|divide> <number> <number>",
    );
  }

  const left = Number(leftInput);
  const right = Number(rightInput);

  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new Error("Both operands must be finite numbers.");
  }

  console.log(operations[operation](left, right));
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
