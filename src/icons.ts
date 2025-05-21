import { addIcon } from "obsidian";
import { Align } from "settings";

export const ICONS = {
	"align-left": `
	<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
		<rect width="100" height="7" fill="currentColor"/>
		<rect y="31" width="70" height="7" fill="currentColor"/>
		<rect y="62" width="100" height="7" fill="currentColor"/>
		<rect y="93" width="70" height="7" fill="currentColor"/>
	</svg>
	`,
	"align-center": `
	<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
		<rect width="100" height="7" fill="currentColor"/>
		<rect y="31" x="15" width="70" height="7" fill="currentColor"/>
		<rect y="62" width="100" height="7" fill="currentColor"/>
		<rect y="93" x="15" width="70" height="7" fill="currentColor"/>
	</svg>
	`,
	"align-right": `
	<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
		<rect width="100" height="7" fill="currentColor"/>
		<rect y="31" x="30" width="70" height="7" fill="currentColor"/>
		<rect y="62" width="100" height="7" fill="currentColor"/>
		<rect y="93" x="30" width="70" height="7" fill="currentColor"/>
	</svg>
	`,
} as Record<Align, string>;

export default function addIcons() {
	for (const icon in ICONS) {
		addIcon(icon, ICONS[icon as Align]);
	}
}
