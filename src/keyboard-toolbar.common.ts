import { ContentView, View } from "tns-core-modules/ui/content-view";
import { Property } from "tns-core-modules/ui/core/properties";
import { AddChildFromBuilder } from "tns-core-modules/ui/core/view";
import {
	booleanConverter,
	EventData,
} from "tns-core-modules/ui/core/view-base";
import { VerticalAlignment } from "tns-core-modules/ui/styling/style-properties";

export interface HeightChangedEventData extends EventData {
	info: {
		animateToY: number;
		lastKeyboardHeight: number;
	};
}

export const forIdProperty = new Property<ToolbarBase, string>({
	name: "forId",
});

export const showWhenKeyboardHiddenProperty = new Property<
	ToolbarBase,
	boolean
>({
	name: "showWhenKeyboardHidden",
	defaultValue: false,
	valueConverter: booleanConverter,
});

export const showAtBottomWhenKeyboardHiddenProperty = new Property<
	ToolbarBase,
	boolean
>({
	name: "showAtBottomWhenKeyboardHidden",
	defaultValue: false,
	valueConverter: booleanConverter,
});

export abstract class ToolbarBase
	extends ContentView
	implements AddChildFromBuilder {
	content: View;
	verticalAlignment: VerticalAlignment;
	isShowingKeyboard: boolean;

	private static DEBUG = false;

	// if the keyboard is hidden without blurring the textfield (and vice versa) then the blur/focus events don't fire, so track focus manually
	protected hasFocus = false;

	protected forId: string;

	/** Customized, allow you to provide a view directly because `forId` is lame */
	protected forView: View;

	protected showWhenKeyboardHidden: boolean;

	// TODO rename showAtBottomWhenKeyboardHidden to moveToAtBottomWhenKeyboardHidden (?)
	protected showAtBottomWhenKeyboardHidden: boolean;

	public static viewFoundedEvent: string = "viewFounded";
	public static heightChangedEvent: string = "heightChanged";

	protected abstract _loaded(): void;

	protected abstract _unloaded(): void;

	protected _layout(
		left: number,
		top: number,
		right: number,
		bottom: number
	): void {}

	protected log(what: string): void {
		if (ToolbarBase.DEBUG) {
			console.log("⌨︎ " + what);
		}
	}

	onLoaded(): void {
		super.onLoaded();
		// TODO figure out how to determine and apply the parent's height automatically based on the child's height
		if (isNaN(+this.height)) {
			console.log(
				`\n1 ⌨ ⌨ ⌨ Please specify height="<nr of px>" or the toolbar won't render correctly! Example: <Toolbar forId="${this.forId}" height="44">\n\n`
			);
		}
		this._loaded();
	}

	onUnloaded(): void {
		super.onUnloaded();
		this._unloaded();
	}

	public onLayout(
		left: number,
		top: number,
		right: number,
		bottom: number
	): void {
		super.onLayout(left, top, right, bottom);
		this._layout(left, top, right, bottom);
	}

	_addChildFromBuilder(name: string, value: View): void {
		this.content = value;
	}

	[forIdProperty.setNative](value: string) {
		this.forId = value;
	}

	[showWhenKeyboardHiddenProperty.setNative](value: boolean) {
		this.showWhenKeyboardHidden = value;
	}

	[showAtBottomWhenKeyboardHiddenProperty.setNative](value: boolean) {
		this.showAtBottomWhenKeyboardHidden = value;
	}
}

forIdProperty.register(ToolbarBase);
showWhenKeyboardHiddenProperty.register(ToolbarBase);
showAtBottomWhenKeyboardHiddenProperty.register(ToolbarBase);
