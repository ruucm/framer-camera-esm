
import * as React from "react"
import { Frame, addPropertyControls, ControlType } from "framer"

export function icon_lens(props) {
    const { scale, radius, fillColor, iconColor, ...rest } = props
    const fill = fillColor
    const icon = iconColor

    return (
        <Frame
            name="IconLens"
            center
            size={100}
            background={fillColor}
            radius={radius}
            scale={scale}
        >
            <Frame
                name="Lens"
                center
                size={56}
                background={""}
                radius={"50%"}
                shadow={`inset 0 0 0 6px ${icon}`}
            >
                <Frame
                    name="Flash"
                    size={8}
                    top={2}
                    right={-8}
                    radius={"50%"}
                    background={icon}
                />
            </Frame>
        </Frame>
    )
}
const defaultProps = {
    height: 100,
    width: 100,
    scale: 1,
    radius: 50,
    fillColor: "#000",
    iconColor: "#fff",
}

icon_lens.defaultProps = defaultProps
icon_lens.displayName = "Lens Icon"

// Learn more: https://framer.com/api/property-controls/
addPropertyControls(icon_lens, {
    scale: {
        title: "Scale",
        type: ControlType.Number,
        defaultValue: defaultProps.scale,
        min: 0.25,
        max: 1.5,
        step: 0.25,
        displayStepper: true,
    },
    radius: {
        title: "Radius",
        type: ControlType.Number,
        defaultValue: defaultProps.radius,
        min: 0,
        max: 50,
        step: 1,
        displayStepper: true,
    },
    fillColor: {
        title: "Fill",
        type: ControlType.Color,
        defaultValue: defaultProps.fillColor,
    },
    iconColor: {
        title: "Icon",
        type: ControlType.Color,
        defaultValue: defaultProps.iconColor,
    },
})
