import { BubbleMenu as BaseBubbleMenu, useEditorState } from "@tiptap/react";
import { useCallback, useRef } from "react";
import { type Instance, sticky } from "tippy.js";
import { v4 as uuid } from "uuid";

import { Icon } from "../components/icon";
import type { MenuProps } from "../components/link-menu.types";
import {
  ToolbarButton,
  ToolbarDivider,
  ToolbarWrapper,
} from "../components/toolbar";
import { getRenderContainer } from "../utils/getRenderContainer";
import { ImageBlockWidth } from "./image-block-width";

export const ImageBlockMenu = ({
  editor,
  appendTo,
}: MenuProps): JSX.Element => {
  const menuRef = useRef<HTMLDivElement>(null);
  const tippyInstance = useRef<Instance | null>(null);

  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor, "node-imageBlock");
    const rect =
      renderContainer?.getBoundingClientRect() ||
      new DOMRect(-1000, -1000, 0, 0);

    return rect;
  }, [editor]);

  const shouldShow = useCallback(() => {
    const isActive = editor.isActive("imageBlock");

    return isActive;
  }, [editor]);

  const onAlignImageLeft = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setImageBlockAlign("left")
      .run();
  }, [editor]);

  const onAlignImageCenter = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setImageBlockAlign("center")
      .run();
  }, [editor]);

  const onAlignImageRight = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setImageBlockAlign("right")
      .run();
  }, [editor]);

  const onWidthChange = useCallback(
    (value: number) => {
      editor
        .chain()
        .focus(undefined, { scrollIntoView: false })
        .setImageBlockWidth(value)
        .run();
    },
    [editor],
  );
  const { isImageCenter, isImageLeft, isImageRight, width } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isImageLeft: ctx.editor.isActive("imageBlock", { align: "left" }),
        isImageCenter: ctx.editor.isActive("imageBlock", { align: "center" }),
        isImageRight: ctx.editor.isActive("imageBlock", { align: "right" }),
        width: parseInt(ctx.editor.getAttributes("imageBlock")?.width || 0),
      };
    },
  });

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey={`imageBlockMenu-${uuid()}`}
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        offset: [0, 8],
        popperOptions: {
          modifiers: [{ name: "flip", enabled: false }],
        },
        getReferenceClientRect,
        onCreate: (instance: Instance) => {
          tippyInstance.current = instance;
        },
        appendTo: () => {
          return appendTo?.current;
        },
        plugins: [sticky],
        sticky: "popper",
      }}
    >
      <ToolbarWrapper shouldShowContent={shouldShow()} ref={menuRef}>
        <ToolbarButton
          tooltip="Align image left"
          active={isImageLeft}
          onClick={onAlignImageLeft}
        >
          <Icon name="AlignHorizontalDistributeStart" />
        </ToolbarButton>
        <ToolbarButton
          tooltip="Align image center"
          active={isImageCenter}
          onClick={onAlignImageCenter}
        >
          <Icon name="AlignHorizontalDistributeCenter" />
        </ToolbarButton>
        <ToolbarButton
          tooltip="Align image right"
          active={isImageRight}
          onClick={onAlignImageRight}
        >
          <Icon name="AlignHorizontalDistributeEnd" />
        </ToolbarButton>
        <ToolbarDivider />
        <ImageBlockWidth onChange={onWidthChange} value={width} />
      </ToolbarWrapper>
    </BaseBubbleMenu>
  );
};
