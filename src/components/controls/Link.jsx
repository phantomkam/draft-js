import React, { useState } from "react";
import { CompositeDecorator, EditorState, Modifier } from "draft-js";
import 'antd/dist/antd.css';
export const Link = (props) => {

    const { entityKey, contentState, children } = props;
    let { url } = contentState.getEntity(entityKey).getData();
    return (
        <span>
            <a
                style={{ color: "blue", fontStyle: "italic" }}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="link-url"
            >
                {children}
            </a>
        </span>
    );
};
export const findLinkEntities = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === "LINK"
        );
    }, callback);
};
export const createLinkDecorator = () =>
    new
        CompositeDecorator
        ([
            {
                strategy: findLinkEntities,
                component: Link,
            },
        ]);
// call all together
export const onAddLink = (editorState, setEditorState) => {
    let linkUrl = window.prompt("Add link http:// ");
    const decorator = createLinkDecorator();
    if (linkUrl) {
        let displayLink = window.prompt("Display Text");
        if (displayLink) {
            const currentContent = editorState.getCurrentContent();
            let entityKey = currentContent.getLastCreatedEntityKey();
            const selection = editorState.getSelection();
            const textWithEntity = Modifier.insertText(
                currentContent,
                selection,
                displayLink,
                null,
                entityKey
            );
            let newState = EditorState.createWithContent(textWithEntity, decorator);
            setEditorState(newState);
        }
    }
};