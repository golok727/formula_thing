# af_formula

A lightweight, extensible formula language for embedding in applications, especially for spreadsheet-like or data-driven environments.

---

## Table of Contents
- [af\_formula](#af_formula)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Language Features](#language-features)
    - [1. Expressions](#1-expressions)
    - [2. Function Calls](#2-function-calls)
    - [3. Member Access](#3-member-access)
  - [Built-in Functions](#built-in-functions)
    - [Standard Library](#standard-library)
    - [Custom Functions](#custom-functions)
  - [Example Usage](#example-usage)
    - [Data Environment](#data-environment)
    - [Running a Formula](#running-a-formula)
  - [Extending the Language](#extending-the-language)
  - [Syntax Reference](#syntax-reference)
  - [Project Structure](#project-structure)
  - [Setup \& Running](#setup--running)

---

## Overview

**af_formula** supports expressions, function calls, custom environments, and a standard library of functions. It is designed for easy integration and extension.

---

## Language Features

### 1. Expressions
- **Literals:** Numbers, strings, booleans  
  Example: `42`, `"hello"`, `true`
- **Identifiers:** Variable or function names  
  Example: `prop`, `concat`
- **Binary Operations:**  
  Supported: `+`, `-`, `*`, `/`, `%`, `==`, `!=`, `<`, `>`, `<=`, `>=`, `&&`, `||`  
  Example: `prop("Age") >= 18`
- **Unary Operations:**  
  Supported: `-`, `!`  
  Example: `-5`, `!true`
- **Parentheses:** For grouping  
  Example: `(1 + 2) * 3`

### 2. Function Calls
- Call functions with arguments:  
  Example: `concat("Hello, ", prop("Name"))`
- Nested calls are supported:  
  Example: `if(prop("Age") >= 18, "Adult", "Minor")`

### 3. Member Access
- Access properties or methods:  
  Example: `prop("Name").length`

---

## Built-in Functions

### Standard Library
> Note: `prop` is not a standard lib function
- **if(condition, trueBranch, falseBranch):**  
  Conditional branching  
  Example: `if(prop("Age") >= 18, "Adult", "Minor")`
- **concat(...args):**  
  Concatenate strings  
  Example: `concat("Hello, ", prop("Name"))` 
  or just use `+` operator `"Hello, " + prop("Name")`

### Custom Functions
You can define your own functions by extending the environment.  
Example:
```ts
runtime.define({
  type: "function",
  linkname: "double",
  description: "Doubles a number",
  fn: (_, args) => new NumberValue(args.get(0).asNumber() * 2),
});
```
---

## Example Usage

### Data Environment
You can bind the formula engine to a data source and access row/column data via the `prop` function.

```ts
const src = `
if(
  prop("Age") >= 18, 
  concat(prop("Name"), " is ", "Adult"),
  concat(prop("Name"), " is ", "Minor")
)
`;
```

### Running a Formula

```ts
// a runtime is just a environment which has the standard library functions
const runtime = new FormulaRuntime(); 
const formula = new Formula(src, "Test").compile();
const instance = runtime.createInstance(formula, new RowEnvironment("1", sourceEnv));
const result = instance.eval();
console.log(result.asString());
```

---

## Extending the Language

- **Add new functions:**  
  Use `environment.define({ ... })` to register new functions.
- **Custom environments:**  
  Extend `Environment` to provide context-aware functions (e.g., row/column access).

---

## Syntax Reference

| Feature         | Example                                 |
|-----------------|-----------------------------------------|
| Number          | `123`, `3.14`                           |
| String          | `"hello"`, `'world'`                    |
| Boolean         | `true`, `false`                         |
| Binary Op       | `a + b`, `x >= 10`, `a && b`            |
| Unary Op        | `-x`, `!flag`                           |
| Function Call   | `if(cond, a, b)`, `concat(a, b, c)`     |
| Member Access   | `prop("Name").length`                  |
| Parentheses     | `(a + b) * c`                           |

---

## Project Structure

- `src/` — Source code
  - `language/` — Core formula engine
  - `parser/` — Lexer and parser
  - `__mock.ts` — Mock data and helpers
  - `runtime.ts` — Standard library functions

---

## Setup & Running

To install dependencies:

```bash
bun install
```

To run the REPL:

```bash
bun run repl 
```

To run a script:
```bash
bun run index.ts
```


---
