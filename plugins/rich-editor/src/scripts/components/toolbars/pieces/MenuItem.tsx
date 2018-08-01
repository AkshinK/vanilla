/**
 * @author Adam (charrondev) Charron <adam.c@vanillaforums.com>
 * @copyright 2009-2018 Vanilla Forums Inc.
 * @license https://opensource.org/licenses/GPL-2.0 GPL-2.0
 */

import React from "react";
import classnames from "classnames";

export interface IMenuItemData {
    icon: JSX.Element;
    label: string;
    isActive: boolean;
    isDisabled?: boolean;
    onClick: (event?: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface IProps extends IMenuItemData {
    role: "menuitem" | "menuitemradio";
    focusNextItem: () => void;
    focusPrevItem: () => void;
}

/**
 * A component that when used with MenuItems provides an accessible WCAG compliant Menu implementation.
 *
 * @see https://www.w3.org/TR/wai-aria-practices-1.1/#menu
 */
export default class MenuItem extends React.PureComponent<IProps> {
    private buttonRef: React.RefObject<HTMLButtonElement> = React.createRef();
    public render() {
        const { label, isDisabled, isActive, onClick, icon, role } = this.props;
        const buttonClasses = classnames("richEditor-button", "richEditor-formatButton", "richEditor-menuItem", {
            isActive,
        });

        const ariaAttributes = {
            role,
            "aria-label": label,
        };

        if (role === "menuitem") {
            ariaAttributes["aria-pressed"] = isActive;
        } else {
            ariaAttributes["aria-checked"] = isActive;
        }

        return (
            <button
                {...ariaAttributes}
                className={buttonClasses}
                type="button"
                onClick={onClick}
                disabled={isDisabled}
                onKeyDown={this.handleKeyPress}
                ref={this.buttonRef}
            >
                {icon}
            </button>
        );
    }

    /**
     * Focus the button inside of this MenuItem.
     */
    public focus() {
        this.buttonRef.current && this.buttonRef.current.focus();
    }

    /**
     * Implement arrow keyboard shortcuts in accordance with the WAI-ARIA best practices for menuitems.
     *
     * @see https://www.w3.org/TR/wai-aria-practices/examples/menubar/menubar-2/menubar-2.html
     */
    private handleKeyPress = (event: React.KeyboardEvent<any>) => {
        switch (event.key) {
            case "ArrowRight":
            case "ArrowDown":
                event.stopPropagation();
                event.preventDefault();
                this.props.focusNextItem();
                break;
            case "ArrowUp":
            case "ArrowLeft":
                event.stopPropagation();
                event.preventDefault();
                this.props.focusPrevItem();
                break;
        }
    };
}
