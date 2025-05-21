import TableInserter from "main";
import { PluginSettingTab, Setting } from "obsidian";

export const enum Align {
	left = "align-left",
	center = "align-center",
	right = "align-right",
}
export interface PluginSettings {
	insertGridSize: number;
	alignment: Align;
	allowCustomSizes: boolean;
	showAlignmentOnModal: boolean;
	overwriteInsertTable: boolean;
}

export const DEFAULT_SETTINGS: PluginSettings = {
	insertGridSize: 10,
	alignment: Align.center,
	allowCustomSizes: false,
	showAlignmentOnModal: true,
	overwriteInsertTable: true,
};

export class SettingsTab extends PluginSettingTab {
	plugin: TableInserter;

	constructor(plugin: TableInserter) {
		super(plugin.app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Table Inserter Settings" });

		new Setting(containerEl)
			.setName("Allow Custom Sizes")
			.setDesc(
				"Show text boxes for width and height that can be used instead of the grid on the insert table modal."
			)
			.addToggle((cb) =>
				cb
					.setValue(this.plugin.settings.allowCustomSizes)
					.onChange(async (value) => {
						this.plugin.settings.allowCustomSizes = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("Show Alignment Buttons")
			.setDesc("Show alignment buttons on the insert table modal.")
			.addToggle((cb) =>
				cb
					.setValue(this.plugin.settings.showAlignmentOnModal)
					.onChange(async (value) => {
						this.plugin.settings.showAlignmentOnModal = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("Overwrite Insert Table Right Click Option")
			.setDesc("Replace the default insert table option in the right click menu (Insert > Table).")
			.addToggle((cb) =>
				cb
					.setValue(this.plugin.settings.overwriteInsertTable)
					.onChange(async (value) => {
						this.plugin.settings.overwriteInsertTable = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("Insert Table Grid Size")
			.setDesc("The maximum size of the grid on the insert table modal.")
			.addSlider((slider) =>
				slider
					.setLimits(2, 25, 1)
					.setValue(this.plugin.settings.insertGridSize)
					.onChange(async (value) => {
						this.plugin.settings.insertGridSize = value;
						await this.plugin.saveSettings();
					})
					.setDynamicTooltip()
			);
		const alignment = new Setting(containerEl)
			.setName("Default Table Alignment")
			.setDesc("The alignment of table content in newly created tables.")
			.addButton((button) =>
				button
					.setIcon("align-left")
					.setTooltip("Align Left")
					.setClass("TIns-align-button")
					.setDisabled(this.plugin.settings.alignment === Align.left)
					.onClick(async (e) => {
						alignment.components.forEach((b) =>
							b.setDisabled(false)
						);
						button.setDisabled(true);
						this.plugin.settings.alignment = Align.left;
						await this.plugin.saveSettings();
					})
			)
			.addButton((button) =>
				button
					.setIcon("align-center")
					.setTooltip("Center")
					.setClass("TIns-align-button")
					.setDisabled(
						this.plugin.settings.alignment === Align.center
					)
					.onClick(async (e) => {
						alignment.components.forEach((c) =>
							c.setDisabled(false)
						);
						button.setDisabled(true);
						this.plugin.settings.alignment = Align.center;
						await this.plugin.saveSettings();
					})
			)
			.addButton((button) =>
				button
					.setIcon("align-right")
					.setTooltip("Align Right")
					.setClass("TIns-align-button")
					.setDisabled(this.plugin.settings.alignment === Align.right)
					.onClick(async (e) => {
						alignment.components.forEach((c) =>
							c.setDisabled(false)
						);
						button.setDisabled(true);
						this.plugin.settings.alignment = Align.right;
						await this.plugin.saveSettings();
					})
			);
	}
	hide() {
		this.plugin.insertTableModal.updateSettings(this.plugin.settings);
	}
}
