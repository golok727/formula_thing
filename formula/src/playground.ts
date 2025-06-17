import { MockDataSource, type DataSource } from './__mock.js';
import {
  BooleanValue,
  NumberValue,
  StringValue,
  Environment,
  Formula,
  type FunctionDefinition,
  None,
} from './language/index.js';
import { FormulaRuntime } from './std/runtime.js';
import { evaluateFormula } from './utils.js';

const source1 = new MockDataSource({
  Age: {
    '1': 20,
    '2': 11,
  },
  Name: {
    '1': 'Alice',
    '2': 'Bob',
  },
});

class DataViewFormulaEnvironment extends Environment {
  constructor(public readonly dataSource: DataSource) {
    super();
    this.define({
      type: 'function',
      description: 'Name of the data source',
      linkname: 'sourceName',
      fn: () => {
        return new StringValue(this.dataSource.getTitle());
      },
    });
  }
}

class RowEnvironment extends Environment {
  constructor(
    public readonly rowId: string,
    parent: DataViewFormulaEnvironment,
  ) {
    super(parent);
    this.define({
      type: 'function',
      description: 'Get the value of a column in the current row',
      linkname: 'prop',
      fn: RowEnvironment._prop,
    });
  }

  private static _prop: FunctionDefinition<RowEnvironment>['fn'] = (
    env,
    args,
  ) => {
    let rowId = env.rowId;
    let colName = args.get(0);
    if (colName.isNone()) {
      throw new Error('Column name must be provided to prop function.');
    }
    let cell = (env.parent as DataViewFormulaEnvironment).dataSource.getCell(
      rowId,
      colName.asString(),
    );
    switch (typeof cell) {
      case 'string':
        return new StringValue(cell);
      case 'number':
        return new NumberValue(cell);
      case 'boolean':
        return new BooleanValue(cell);
      default:
        return None;
    }
  };
}

const src = `
if(
	prop("Age") >= 18, 
	prop("Name") + " is " + "Adult",
	if(
		prop("Age") >= 10,
		prop("Name") +  " is " + "Teenager",
		prop("Name")+ " is "+ "Child"
	)
)
`.trim();

// gives functions like `if`, 'concat' etc..
let rt = new FormulaRuntime();
rt.define({
  type: 'function',
  linkname: 'now',
  description: 'Returns the current date and time',
  fn: (runtime) => {
    console.log(runtime, runtime instanceof FormulaRuntime);
    return new StringValue(new Date().toDateString());
  },
});

// for each database create a new environment
let sourceEnv = new DataViewFormulaEnvironment(source1);
sourceEnv.setParent(rt);
const [formula, error] = new Formula(src, 'First formula').compileSafe();
if (error) {
  console.error('Compilation errors:', error);
  throw new Error('Compilation failed');
}
// each cell can have its own instance of the formula
const row1 = formula.createInstance(new RowEnvironment('1', sourceEnv));
const row2 = formula.createInstance(new RowEnvironment('2', sourceEnv));

console.log(row1.eval().asString());
console.log(row2.eval().asString());

const fizzBuzz = `
range(1, 100).map(|n| 
		n % 3 == 0 and n % 5 == 0 ? "Fizzbuzz" : 
		n % 3 == 0 ? "Fizz": 
		n % 5 == 0 ? "Buzz" : n
	)
`;
const fizzBuzz1 = `
range(1, 100).map(|n|
	if(
		n % 3 == 0 and n % 5 == 0, "Fizzbuzz",
		if ( 
				n % 3 == 0, "Fizz", 
				if(n % 5 == 0, "Buzz", n)
			)
	)
)
`;

console.log('\n\n');
console.log('Example FizzBuzz:\n--------------------');
console.log(evaluateFormula(fizzBuzz, new Environment(rt)).asString());
console.log('\n\n');
console.log(evaluateFormula(fizzBuzz1, new Environment(rt)).asString());

{
  console.log('\n\n');
  console.log('Example Fibonacci:\n--------------------');
  const env = new Environment(rt);

  {
    const src = `
			let(
				fib = |n| n <= 2 ? n : fib(n - 1) + fib(n - 2),	
				range(0, 20).map(fib)
			)
		`;
    console.log(evaluateFormula(src, env).asString());
  }
}

{
  console.log('\n\n');
  console.log('Example String:\n--------------------');
  const env = new Environment(rt);

  {
    const src = String.raw`
			let(
				a = [1, 2, 3, 4, 5],
				a.map(string).join(",\n")
			)
		`;
    console.log(evaluateFormula(src, env).asString());
  }
}
