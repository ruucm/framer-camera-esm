import * as React from "react"
import { Frame, addPropertyControls, ControlType } from "framer"

export function icon_view(props) {
    const { scale, radius, fillColor, iconColor, ...rest } = props
    const fill = fillColor
    const icon = iconColor
    const clear = ""
    const end = 16
    const size = 16
    const thick = 6
    const endMargin = 6
    const outlineRadius = 10

    return (
        <Frame
            name="IconView"
            center
            size={100}
            background={fill}
            radius={radius}
            scale={scale}
        >
            <Frame
                name="View"
                center
                size={56}
                background={""}
                radius={outlineRadius}
            >
                <Frame
                    name="CornerLeftTop"
                    size={size}
                    background={clear}
                    radius={`${outlineRadius}px 0 0 0`}
                    shadow={`inset ${thick}px ${thick}px 0 0px ${icon}`}
                >
                    <Frame
                        background={icon}
                        width={thick}
                        height={end}
                        radius={thick / 2}
                        top={endMargin}
                    />
                    <Frame
                        background={icon}
                        width={end}
                        height={thick}
                        radius={thick / 2}
                        left={endMargin}
                    />
                </Frame>
                <Frame
                    name="CornerRightTop"
                    size={size}
                    right={0}
                    background={clear}
                    radius={`0 ${outlineRadius}px 0 0`}
                    shadow={`inset -${thick}px ${thick}px 0 0px ${icon}`}
                >
                    <Frame
                        background={icon}
                        width={thick}
                        height={end}
                        radius={thick / 2}
                        top={endMargin}
                        right={0}
                    />
                    <Frame
                        background={icon}
                        width={end}
                        height={thick}
                        radius={thick / 2}
                        left={-endMargin}
                    />
                </Frame>
                <Frame
                    name="CornerRightBottom"
                    size={size}
                    right={0}
                    bottom={0}
                    background={clear}
                    radius={`0 0 ${outlineRadius}px 0`}
                    shadow={`inset -${thick}px -${thick}px 0 0px ${icon}`}
                >
                    <Frame
                        background={icon}
                        width={thick}
                        height={end}
                        radius={thick / 2}
                        bottom={endMargin}
                        right={0}
                    />
                    <Frame
                        background={icon}
                        width={end}
                        height={thick}
                        radius={thick / 2}
                        left={-endMargin}
                        bottom={0}
                    />
                </Frame>
                <Frame
                    name="CornerLeftBottom"
                    size={size}
                    left={0}
                    bottom={0}
                    background={clear}
                    radius={`0 0 0 ${outlineRadius}px`}
                    shadow={`inset ${thick}px -${thick}px 0 0px ${icon}`}
                >
                    <Frame
                        background={icon}
                        width={thick}
                        height={end}
                        radius={thick / 2}
                        bottom={endMargin}
                        left={0}
                    />
                    <Frame
                        background={icon}
                        width={end}
                        height={thick}
                        radius={thick / 2}
                        left={endMargin}
                        bottom={0}
                    />
                </Frame>
                <Frame
                    center
                    size={44}
                    background={fill}
                    radius={thick}
                    opacity={1}
                />
            </Frame>
            <Frame
                name="Lens"
                center
                size={56}
                background={""}
                radius={"50%"}
                shadow={`inset 0 0 0 6px ${icon}`}
                opacity={0}
            ></Frame>
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

icon_view.defaultProps = defaultProps
icon_view.displayName = "View Icon"

// Learn more: https://framer.com/api/property-controls/
addPropertyControls(icon_view, {
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
