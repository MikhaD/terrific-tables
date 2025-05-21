import addIcons from "icons";
import InsertTableModal from "InsertTableModal";
import { Editor, MarkdownView, Menu, Notice, Plugin } from "obsidian";
import { DEFAULT_SETTINGS, PluginSettings, SettingsTab } from "settings";

export default class TableInserter extends Plugin {
	settings: PluginSettings;
	insertTableModal: InsertTableModal;

	async onload() {
		const ribbonIconEl = this.addRibbonIcon(
			"table",
			"Insert table",
			(evt: MouseEvent) => {
				const editor =
					this.app.workspace.getActiveViewOfType(
						MarkdownView
					)?.editor;
				if (!editor) {
					new Notice("Place your cursor where you want to insert the table.");
					return;
				}
				this.insertTableModal.open(editor);
			}
		);
		await this.loadSettings();
		// THIS IS NOT A GREAT WAY TO IDENTIFY THE MENU & MENU ITEM, NEED TO FIND A BETTER WAY THAT IS ALSO UI LANGUAGE AGNOSTIC
		const SUBMENU_POSITION = 2;
		const INSERT_TABLE_POSITION = 1;
		this.registerEvent(
			this.app.workspace.on(
				"editor-menu",
				(menu: Menu, editor: Editor, view: MarkdownView) => {
					// Identify and replace the Insert > Table menu item
					menu = menu.items.filter(
						(i) => i.section === "selection"
					)[SUBMENU_POSITION]?.submenu;
					if (!menu) return;
					menu.addItem((item) => {
						item
						.setTitle("Table")
						.setIcon("table")
						.setSection("selection-insert-basic")
						.onClick(async () => {
							this.insertTableModal.open(editor);
						});
					});
					const item = menu.items.pop();
					menu.items.splice(INSERT_TABLE_POSITION, 1, item);
				}
			)
		);
		this.insertTableModal = new InsertTableModal(this.app, this.settings);
		addIcons();

		this.addCommand({
			id: "insert-table-modal",
			name: "Insert table",
			hotkeys: [
				{
					modifiers: ["Mod", "Shift"],
					key: "3",
				},
			],
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.insertTableModal.open(editor);
			},
		});

		this.addSettingTab(new SettingsTab(this));
	}

	onunload() {
		this.insertTableModal = null;
		this.settings = null;
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
