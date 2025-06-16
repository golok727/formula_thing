import * as monaco from "monaco-editor";
import "./style.css";
import { FormulaRuntime, Formula, NumberValue } from "formula";

console.log("Radhey Shyam");

// Utility function to create a debounced version of a function
function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: number | undefined;

	return function (...args: Parameters<T>): void {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};

		clearTimeout(timeout);
		timeout = setTimeout(later, wait) as unknown as number;
	};
}

class Mountable {
	constructor(protected _view: HTMLElement = document.createElement("div")) {}

	get view() {
		return this._view;
	}

	init() {}

	mount(container: HTMLElement) {
		container.append(this._view);
		requestAnimationFrame(() => {
			this.init();
		});
	}
}

class ResultView extends Mountable {
	constructor() {
		super();

		this._view.innerHTML = `
		<div class="formula-editor-result" >
		<span style="font-weight: bold; color: hsl(0 0 50%);">=</span>
		<div id="result" style="flex: 1;">Hello</div>
		<div>
					`;
	}

	update(res: string) {
		const resultThing = this._view.querySelector("#result");
		if (resultThing) resultThing.textContent = res;
	}
}

class FormulaEditor extends Mountable {
	private header = document.createElement("header");
	private result = new ResultView();
	private editor: monaco.editor.IStandaloneCodeEditor | null = null;
	private editorContainer: HTMLElement;
	private runtime = new FormulaRuntime();
	private debouncedRunFormula: () => void;

	constructor(initialText = "") {
		super();
		this.runtime.define({
			type: "function",
			linkname: "pow",
			description: "Calculate power of a number",
			fn: (_, args) => {
				const base = args.get(0);
				const exponent = args.get(1);
				if (!NumberValue.is(base) || !NumberValue.is(exponent)) {
					throw new Error("Both arguments must be numbers");
				}
				return new NumberValue(Math.pow(base.asNumber(), exponent.asNumber()));
			},
		});

		this._view.spellcheck = false;
		this._view.classList.add("formula-editor");

		this.header.classList.add("formula-editor-header");
		this.header.innerHTML = `
		<div style="font-size: .8rem; font-weight: bold;">Formula Editor Pro</div>
		`;

		this.editorContainer = document.createElement("div");
		this.editorContainer.classList.add("monaco-editor-container");
		this.editorContainer.style.height = "200px";
		this.editorContainer.style.width = "100%";

		// Initialize code content
		this._initialCode = initialText;

		// Create debounced version of runFormula (500ms delay)
		this.debouncedRunFormula = debounce(this.runFormula.bind(this), 500);
	}

	private _initialCode: string;

	override init(): void {
		// Register the formula language
		this.registerFormulaLanguage();

		// Create the editor
		this.editor = monaco.editor.create(this.editorContainer, {
			value: this._initialCode,
			language: "formula",
			theme: "vs-dark",
			minimap: { enabled: false },
			automaticLayout: true,
			fontSize: 14,
			lineNumbers: "off",
			scrollBeyondLastLine: false,
			roundedSelection: false,
			padding: { top: 8 },
		});

		// Set up the change event listener for auto-run
		this.editor.onDidChangeModelContent(() => {
			// Run after throttled delay
			this.debouncedRunFormula();
		});

		// Run on start
		setTimeout(() => {
			this.runFormula();
		}, 100);

		// Handle resize
		window.addEventListener("resize", () => {
			if (this.editor) {
				this.editor.layout();
			}
		});
	}

	runFormula(): void {
		if (!this.editor) return;

		const text = this.editor.getValue();
		const [formula, error] = new Formula(text).compileSafe();

		if (error) {
			console.error("Failed to compile formula:", error);
			this.result.update(`Error: ${error.message}`);
			return;
		}

		const instance = this.runtime.createInstance(formula);

		try {
			const res = instance.eval();
			this.result.update(res.asString());
		} catch (e) {
			console.error("Error during evaluation:", e);
			this.result.update(
				`Error: ${e instanceof Error ? e.message : String(e)}`
			);
		}
	}

	mount(container: HTMLElement): void {
		super.mount(container);

		this._view.append(this.header);
		this.header.after(this.editorContainer);
		this.result.mount(this._view);

		const buttonContainer = document.createElement("div");
		buttonContainer.classList.add("formula-editor-buttons");

		const run = document.createElement("button");
		run.innerText = "Run";
		run.addEventListener("click", () => this.runFormula());

		const save = document.createElement("button");
		save.innerText = "Save";
		save.addEventListener("click", () => {
			if (!this.editor) return;
			const text = this.editor.getValue();
			localStorage.formula_code = text;
		});

		const autoRunToggle = document.createElement("label");
		autoRunToggle.style.display = "flex";
		autoRunToggle.style.alignItems = "center";
		autoRunToggle.style.marginLeft = "auto";
		autoRunToggle.style.cursor = "pointer";
		autoRunToggle.innerHTML = `
			<input type="checkbox" id="autorun-toggle" checked style="margin-right: 5px">
			<span style="font-size: 0.8rem; color: #ccc;">Auto-run</span>
		`;

		const toggleInput = autoRunToggle.querySelector("input")!;
		toggleInput.addEventListener("change", () => {
			if (toggleInput.checked) {
				// Re-enable auto-run listeners
				if (this.editor) {
					this.editor.onDidChangeModelContent(() => this.debouncedRunFormula());
					// Run once immediately when re-enabling
					this.runFormula();
				}
			} else {
				// Disable auto-run listeners
				if (this.editor) {
					const model = this.editor.getModel();
					if (model) {
						monaco.editor
							.getModelMarkers({ resource: model.uri })
							.forEach((marker) => {
								monaco.editor.removeAllMarkers(marker.owner);
							});
					}
				}
			}
		});

		buttonContainer.appendChild(run);
		buttonContainer.appendChild(save);
		buttonContainer.appendChild(autoRunToggle);
		this._view.append(buttonContainer);
	}

	private registerFormulaLanguage() {
		// Register the formula language
		monaco.languages.register({ id: "formula" });

		// Define the token provider for syntax highlighting
		monaco.languages.setMonarchTokensProvider("formula", {
			tokenizer: {
				root: [
					[/let|if|or|and/, "keyword"],
					[/true|false/, "boolean"],
					[/".*?"/, "string"],
					[/'.*?'/, "string"],
					[/\d+(\.\d+)?/, "number"],
					[/\|/, "delimiter.pipe"],
					[/\+|-|\*|\/|>=|<=|>|<|==|!=/, "operator"],
					[/[a-zA-Z_][\w]*/, "identifier"],
				],
			},
		});

		// Configure language features
		monaco.languages.setLanguageConfiguration("formula", {
			brackets: [
				["{", "}"],
				["(", ")"],
				["[", "]"],
			],
			autoClosingPairs: [
				{ open: "{", close: "}" },
				{ open: "(", close: ")" },
				{ open: "[", close: "]" },
				{ open: '"', close: '"' },
				{ open: "'", close: "'" },
			],
			surroundingPairs: [
				{ open: "{", close: "}" },
				{ open: "(", close: ")" },
				{ open: "[", close: "]" },
				{ open: '"', close: '"' },
				{ open: "'", close: "'" },
			],
		});

		// Add intellisense/auto-completion
		monaco.languages.registerCompletionItemProvider("formula", {
			provideCompletionItems: () => {
				const suggestions = [
					{
						label: "let",
						kind: monaco.languages.CompletionItemKind.Keyword,
						insertText: "let(${1:name} = ${2:value}, ${0})",
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: "Define local variables",
					},
					{
						label: "if",
						kind: monaco.languages.CompletionItemKind.Keyword,
						insertText: "if(${1:condition}, ${2:trueValue}, ${3:falseValue})",
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: "Conditional expression",
					},
					{
						label: "lambda",
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: "|${1:params}| ${0:expression}",
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: "Create a lambda function",
					},
					// Add more suggestions as needed
				];

				return { suggestions };
			},
		});
	}

	dispose() {
		if (this.editor) {
			this.editor.dispose();
		}
	}
}

// Create the editor and mount it
document.addEventListener("DOMContentLoaded", () => {
	const initialCode =
		localStorage.formula_code ||
		`let(
  age = 25,
  name = "John",
  greeting = |person| "Hello, " + person + "!",
  greeting(name)
)`;

	const editor = new FormulaEditor(initialCode);
	editor.mount(document.body);
});
