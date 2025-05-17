import { Modal, Editor, App } from "obsidian";
import { Align, PluginSettings } from "settings";

export default class InsertTableModal extends Modal {
	private insertTable: HTMLDivElement[][];
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
		this.contentEl.innerHTML = "";
		this.insertTable = [];
		for (let i = 0; i < size; ++i) {
			this.insertTable.push([]);
			const row = createDiv();
			row.addClass("TIns-insert-row");
			this.contentEl.appendChild(row);
			for (let j = 0; j < size; ++j) {
				const cell = createDiv();
				this.insertTable[i].push(cell);
				cell.addClass("TIns-insert-cell");
				cell.setAttribute("row", `${i + 1}`);
				cell.setAttribute("column", `${j + 1}`);
				cell.addEventListener("mouseenter", e => this.onMouseEnter(e));
				cell.addEventListener("mouseleave", () => this.reset());
				cell.addEventListener("click", e => {
					this.close();

					const table = this.generateTable(e.currentTarget as HTMLElement);

					const lineNum = this.editor.getCursor().line;
					const line = this.editor.getLine(lineNum);
					let extraLines = 0;
					if (this.editor.getCursor().ch > 0) {
						extraLines = 2;
					} else if (lineNum !== 0 && this.editor.getLine(lineNum - 1).length !== 0) {
						extraLines = 1;
					}
					if (this.editor.getCursor().ch === 0 && line.length > 0) {
						this.editor.setLine(lineNum, `${"\n".repeat(extraLines)}${table}\n${line}`);
					} else {
						this.editor.setLine(lineNum, `${line}${"\n".repeat(extraLines)}${table}`);
					}
					this.editor.setCursor({ line: lineNum + extraLines, ch: 2 });
				});
				row.appendChild(cell);
			}
		}
	}

	generateTable(element: HTMLElement) {
		const rows = parseInt(element.getAttribute("row"));
		const columns = parseInt(element.getAttribute("column"));
		const row = "|     ".repeat(columns) + "|";
		const separator = `|${this.settings.alignment === Align.left ? ":" : " "}---${this.settings.alignment === Align.right ? ":" : " "}`.repeat(columns) + "|";
		const table = [row, separator];
		for (let i = 1; i < rows; ++i) {
			table.push(row);
		}
		return table.join("\n");
	}

	reset() {
		this.titleEl.setText("Insert Table");
		this.contentEl.querySelectorAll(".hover").forEach(cell => cell.removeClass("hover"));
	}
	updateSettings(settings: PluginSettings) {
		this.settings = settings;
		this.generateInsertTable(this.settings.insertGridSize);
	};
	/**
	 * @param editor The editor to insert the table into
	 * @override
	 */
	open(editor?: Editor) {
		this.editor = editor;
		super.open();
	}
	onOpen() { }

	onClose() { this.reset(); }

	private onMouseEnter(e: MouseEvent) {
		const element = e.currentTarget as HTMLElement;
		const rows = parseInt(element.getAttribute("row"));
		const columns = parseInt(element.getAttribute("column"));

		this.titleEl.setText(`${columns}×${rows} Table`);

		for (let row = 0; row < rows; ++row) {
			for (let column = 0; column < columns; ++column) {
				this.insertTable[row][column].classList.add("hover");
			}
		}
	}
}
