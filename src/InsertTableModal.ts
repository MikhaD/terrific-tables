import { ICONS } from "icons";
import { Modal, Editor, App, Notice } from "obsidian";
import { Align, PluginSettings } from "settings";

export default class InsertTableModal extends Modal {
	private table: HTMLDivElement[][];
	private editor: Editor;
	private settings: PluginSettings;

	constructor(app: App, settings: PluginSettings) {
		super(app);
		this.settings = settings;
		this.contentEl.addClass("TIns-insert");
		this.titleEl.setText("Insert Table");
		this.titleEl.addClass("TIns-insert-title");
		this.generateInsertTable(this.settings.insertGridSize);
	}

	generateInsertTable(size: number) {
		let alignment = this.settings.alignment;
		this.contentEl.innerHTML = "";
		this.table = [];
		for (let i = 0; i < size; ++i) {
			this.table.push([]);
			const row = createDiv();
			row.addClass("TIns-insert-row");
			this.contentEl.appendChild(row);
			for (let j = 0; j < size; ++j) {
				const cell = createDiv();
				this.table[i].push(cell);
				cell.addClass("TIns-insert-cell");
				cell.setAttribute("row", `${i + 1}`);
				cell.setAttribute("column", `${j + 1}`);
				cell.addEventListener("mouseenter", (e) =>
					this.onMouseEnter(e)
				);
				cell.addEventListener("mouseleave", () => this.reset());
				cell.addEventListener("click", (e) => {
					this.close();
					const element = e.currentTarget as HTMLElement;
					const rows = parseInt(element.getAttribute("row")!);
					const columns = parseInt(element.getAttribute("column")!);

					this.insertTable(this.generateTable(rows, columns, alignment));
				});
				row.appendChild(cell);
			}
		}
		if (this.settings.allowCustomSizes) {
			const custom_size = createDiv({
				cls: "TIns-custom-size",
			});
			const row_input = createEl("input", {
				type: "number",
				attr: {
					min: 1,
					max: 150,
					value: size,
				},
			});
			const col_input = createEl("input", {
				type: "number",
				cls: "TIns-custom-size-input",
				attr: {
					min: 1,
					max: 150,
					value: size,
				},
			});
			const insert = createEl("button", {
				text: "Insert",
				cls: "mod-cta",
			});
			insert.addEventListener("click", () => {
				const rows = parseInt(row_input.value);
				const columns = parseInt(col_input.value);
				if (isNaN(rows) || isNaN(columns)) return;
				this.close();
				this.insertTable(this.generateTable(rows, columns, alignment));
			})
			custom_size.append(
				createEl("span", {
					text: "Rows:",
				}),
				row_input,
				createEl("span", {
					text: "Cols:",
				}),
				col_input,
				insert
			);
			this.contentEl.append(createEl("br"), custom_size);
			row_input.select();
		}
		if (this.settings.showAlignmentOnModal) {
			const buttons: HTMLButtonElement[] = [];
			const align_buttons = createDiv({
				cls: "TIns-align-buttons",
			});
			for (let icon in ICONS) {
				const btn = createEl("button", {
					cls: "TIns-align-button",
				});
				buttons.push(btn);
				if (icon === this.settings.alignment) {
					btn.disabled = true;
				}
				btn.innerHTML = ICONS[icon as Align];
				align_buttons.appendChild(btn);
				btn.addEventListener("click", (e) => {
					alignment = icon as Align;
					for (const button of buttons) {
						button.disabled = false;
					}
					btn.disabled = true;
				});
			}
			this.contentEl.append(createEl("br"), align_buttons);
		}
	}

	generateTable(rows: number, cols: number, alignment: Align) {
		console.log("Generating table:", rows, cols, alignment);
		const row = "|     ".repeat(cols) + "|";
		const separator =
			`|${alignment === Align.right ? " " : ":"}---${
				alignment === Align.left ? " " : ":"
			}`.repeat(cols) + "|";
		const table = [row, separator];
		for (let i = 1; i < rows; ++i) {
			table.push(row);
		}
		return table.join("\n");
	}

	insertTable(table: string) {
		const lineNum = this.editor.getCursor().line;
		const line = this.editor.getLine(lineNum);
		let extraLines = 0;
		if (this.editor.getCursor().ch > 0) {
			extraLines = 2;
		} else if (
			lineNum !== 0 &&
			this.editor.getLine(lineNum - 1).length !== 0
		) {
			extraLines = 1;
		}
		if (this.editor.getCursor().ch === 0 && line.length > 0) {
			this.editor.setLine(
				lineNum,
				`${"\n".repeat(extraLines)}${table}\n${line}`
			);
		} else {
			this.editor.setLine(
				lineNum,
				`${line}${"\n".repeat(extraLines)}${table}`
			);
		}
		this.editor.setCursor({
			line: lineNum + extraLines,
			ch: 2,
		});
	}

	reset() {
		this.titleEl.setText("Insert Table");
		this.contentEl
			.querySelectorAll(".hover")
			.forEach((cell) => cell.removeClass("hover"));
	}
	updateSettings(settings: PluginSettings) {
		this.settings = settings;
		this.generateInsertTable(this.settings.insertGridSize);
	}
	/**
	 * @param editor The editor to insert the table into
	 * @override
	 */
	open(editor?: Editor) {
		if (!editor) throw new Error("Editor is not defined");
		this.editor = editor;
		super.open();
	}
	onOpen() {}

	onClose() {
		this.reset();
	}

	private onMouseEnter(e: MouseEvent) {
		const element = e.currentTarget as HTMLElement;
		const rows = parseInt(element.getAttribute("row")!);
		const columns = parseInt(element.getAttribute("column")!);

		this.titleEl.setText(`Insert ${columns}×${rows} Table`);

		for (let row = 0; row < rows; ++row) {
			for (let column = 0; column < columns; ++column) {
				this.table[row][column].classList.add("hover");
			}
		}
	}
}
