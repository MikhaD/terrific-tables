import addIcons from "icons";
import InsertTableModal from "InsertTableModal";
import { Editor, MarkdownView, Plugin } from "obsidian";
import { DEFAULT_SETTINGS, PluginSettings, SettingsTab } from "settings";

export default class TableInserter extends Plugin {
	settings: PluginSettings;
	insertTableModal: InsertTableModal;

	async onload() {
		await this.loadSettings();
		this.insertTableModal = new InsertTableModal(this.app, this.settings);
		addIcons();

		this.addCommand({
			id: "insert-table-modal",
			name: "Open insert table modal",
			hotkeys: [{
				modifiers: ["Mod"],
				key: "t"
			}],
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.insertTableModal.open(editor);
			}
		});

		this.addSettingTab(new SettingsTab(this));
	}

	onunload() {
		this.insertTableModal = null;
		this.settings = null;
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
