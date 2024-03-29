import * as React from "react"
import { CSSProperties } from "react"
import { Stack, Color, Frame } from "framer"
import { icon_view as IconView } from "./icon_view"
import { icon_lens as IconLens } from "./icon_lens"

// Shared Camera Imports
import { defaultViewId, defaultLensId } from "./index"

interface Props {
    title?: string
    label?: string
    error?: boolean
    striped?: boolean
    icon?: string
}

const textStyles: CSSProperties = {
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "center",
    wordWrap: "normal",
}

const colors = {
    error: "#FF3333",
    placeholder: "rgb(137, 86, 255)",
    placeholderLight: "rgba(137, 86, 255, 0.25)",
}

const stripedStyles = {
    backgroundImage: `linear-gradient(135deg, ${colors.placeholderLight} 5.56%, transparent 5.56%, transparent 50%, ${colors.placeholderLight} 50%, ${colors.placeholderLight} 55.56%, transparent 55.56%, transparent 100%)`,
    backgroundSize: `12.73px 12.73px`,
}

export function placeholderState({
    icon,
    title,
    label,
    error,
    striped = false,
}: Props) {
    const color = Color(error ? colors.error : colors.placeholder)
    const isView = icon === defaultViewId
    const isLens = icon === defaultLensId

    return (
        <Stack
            direction="vertical"
            alignment="center"
            distribution="center"
            size="100%"
            gap={4}
            padding={12}
            radius="calc(4px * var(--framerInternalCanvas-canvasPlaceholderContentScaleFactor, 1))"
            border={`calc(1px * var(--framerInternalCanvas-canvasPlaceholderContentScaleFactor, 1)) dashed ${Color.alpha(
                color,
                1
            ).toValue()}`}
            background={Color.alpha(color, 0.12)}
            style={striped ? stripedStyles : {}}
        >
            <Frame
                size={30}
                radius={"50%"}
                background={colors.placeholder}
                style={{ margin: 10 }}
            >
                {isView && (
                    <IconView scale={0.3} fillColor={colors.placeholder} />
                )}
                {isLens && (
                    <IconLens scale={0.3} fillColor={colors.placeholder} />
                )}
            </Frame>
            i{" "}
            {title && (
                <h5
                    style={{
                        ...textStyles,
                        color: color.toValue(),
                        fontSize:
                            "calc(13px * var(--framerInternalCanvas-canvasPlaceholderContentScaleFactor, 1))",
                        fontWeight: 500,
                        marginBottom:
                            label &&
                            "calc(6px * var(--framerInternalCanvas-canvasPlaceholderContentScaleFactor, 1))",
                    }}
                >
                    {title}
                </h5>
            )}
            {label && (
                <p
                    style={{
                        ...textStyles,
                        color: color.toValue(),
                        fontSize:
                            "calc(12px * var(--framerInternalCanvas-canvasPlaceholderContentScaleFactor, 1))",
                    }}
                >
                    {label}
                </p>
            )}
        </Stack>
    )
}
