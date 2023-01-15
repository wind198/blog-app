import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  SystemStyleObject,
} from "@chakra-ui/react";
import Quill from "quill";
import { KeyboardEvent, useCallback, useMemo, useState } from "react";
import {
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineUnderline,
  AiOutlineStrikethrough,
  AiOutlineAlignCenter,
  AiOutlineAlignLeft,
  AiOutlineAlignRight,
  AiOutlineUnorderedList,
  AiOutlineOrderedList,
  AiOutlineFileImage,
} from "react-icons/ai";
import { RiSubscript } from "react-icons/ri";
import { IoChevronDownOutline, IoImageOutline } from "react-icons/io5";
import { TbBlockquote } from "react-icons/tb";
import "./reset.css";
import EmojiPicker from "./EmojiPicker";
import AddMediaDialog, { IAddMediaFormData } from "./add-media-dialog";
import { db } from "../../db";
import { useNavigate } from "react-router-dom";

const DefaultFontValue = 16;

const Block = Quill.import("blots/block");
const Inline = Quill.import("blots/inline");

class InlineImageBlot extends Block {
  static create(data: IAddMediaFormData) {
    const { alt, src } = data;
    const node: HTMLImageElement = super.create();
    node.setAttribute("src", src);
    node.setAttribute("alt", alt);
    node.innerHTML = "";
    return node;
  }

  static formats(node: HTMLImageElement) {
    return node.getAttribute("src");
  }
}

InlineImageBlot.blotName = "inlineImage";
InlineImageBlot.tagName = "img";

class EmojiBlot extends Inline {
  static create(emoji: string) {
    const node: HTMLElement = super.create(emoji);
    node.innerHTML = emoji;
    node.setAttribute("data-emoji", emoji);
    return node;
  }

  static formats(node: HTMLElement) {
    return node.getAttribute("data-emoji");
  }
}

EmojiBlot.tagName = "span";
EmojiBlot.blotName = "emoji";

Quill.register(EmojiBlot);
Quill.register(InlineImageBlot);

interface IAddBlogEditorProps {}

export default function AddBlogEditor(props: IAddBlogEditorProps) {
  const [quill, setQuill] = useState<Quill | null>(null);

  const navigate = useNavigate();

  const setupEditor = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;

    const quill = new Quill(node, {
      placeholder: "What you are thinking about...",
    });

    setQuill(quill);
  }, []);

  const onClickFormat = useCallback(
    (format: string) => () => {
      const selection = quill?.getSelection();
      if (!selection) return;
      const currentFormat = quill?.getFormat();
      if (!currentFormat) return;
      quill?.format(format, !currentFormat[format]);
    },
    [quill]
  );

  const onClickFormatList = useCallback(
    (listType: string) => () => {
      const selection = quill?.getSelection();
      if (!selection) return;
      const currentFormat = quill?.getFormat();
      if (currentFormat?.list === listType) {
        quill?.format("list", false);
        return;
      }
      quill?.format("list", listType);
    },
    [quill]
  );

  const onClickHeader = useCallback(
    (buttonIndex: number) => () => {
      if (buttonIndex === 8) {
        quill?.format("header", false);
        quill?.format("small", true);
        return;
      }
      if (buttonIndex > 6) {
        quill?.format("header", false);
        quill?.format("small", false);
        return;
      }
      quill?.format("header", buttonIndex);
    },
    [quill]
  );

  const editorStyle: SystemStyleObject = useMemo(
    () => ({
      "& .ql-editor": {
        borderColor: "gray.300",
        borderRadius: "md",
        borderWidth: 1,
        borderStyle: "solid",
        minH: 400,
        maxH: "50vh",
        outline: "none",
        padding: 4,
        fontSize: "sm",
      },
      h1: {
        fontSize: "var(--chakra-fontSizes-5xl)",
      },
      h2: {
        fontSize: "var(--chakra-fontSizes-4xl)",
      },
      h3: {
        fontSize: "var(--chakra-fontSizes-3xl)",
      },
      h4: {
        fontSize: "var(--chakra-fontSizes-2xl)",
      },
      h5: {
        fontSize: "var(--chakra-fontSizes-xl)",
      },
      h6: {
        fontSize: "var(--chakra-fontSizes-lg)",
      },
      small: {
        fontSize: "var(--chakra-fontSizes-sm)",
      },
      ...[1, 2, 3, 4, 5, 6, 7, 8].reduce(
        (p, c) => ({ ...p, [`.ql-indent-${c}`]: { pl: c * 4 } }),
        {}
      ),
      ...["left", "center", "right"].reduce(
        (p, c) => ({
          ...p,
          [`.ql-align-${c}`]: {
            textAlign: c,
          },
          [`img.ql-align-${c}`]: {
            ...(c === "center" && {
              margin: "auto",
            }),
            ...(c === "right" && {
              marginLeft: "auto",
              marginRight: 0,
            }),
            ...(c === "left" && {
              marginRight: "auto",
              marginLeft: 0,
            }),
          },
        }),
        {}
      ),
      "ul, ol": {
        pl: 6,
      },
    }),
    []
  );

  const onPressTabEditor = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      e.stopPropagation();
      const key = e.key;
      const shiftPressed = e.shiftKey;

      if (key !== "Tab") return;

      const currentSelection = quill?.getSelection();
      if (!currentSelection) return;

      const currentIndentFormat = quill?.getFormat()?.indent;
      if (!shiftPressed) {
        if (currentIndentFormat === 8) {
          return;
        }
        if (!currentIndentFormat) {
          quill?.format("indent", 1);
          return;
        }
        quill.format("indent", currentIndentFormat + 1);
        return;
      }
      if (!currentIndentFormat) {
        return;
      }
      if (currentIndentFormat === 1) {
        quill.format("indent", false);
        return;
      }
      quill.format("indent", currentIndentFormat - 1);
    },
    [quill]
  );

  const onClickFormatAlign = useCallback(
    (alignType: string) => () => {
      const currentSelection = quill?.getSelection();
      if (!currentSelection) return;
      if (alignType === "left") {
        quill?.format("align", false);
        return;
      }

      quill?.format("align", alignType);
    },
    [quill]
  );

  const onSelectEmoji = useCallback(
    (emoji: string) => {
      quill?.format("emoji", emoji);
    },
    [quill]
  );

  const [showingAddImageDialog, setShowingAddImageDialog] = useState(false);

  const onSubmitImage = useCallback(
    (data: IAddMediaFormData) => {
      const range = quill?.getSelection(true);
      if (range?.index === undefined) return;
      quill?.insertEmbed(range.index, "inlineImage", data, Quill.sources.USER);
      setShowingAddImageDialog(false);
    },
    [quill]
  );

  const onSubmitBlog = useCallback(async () => {
    const content = quill?.root.innerHTML;
    await db.blogPosts.add({
      content,
      createdAt: new Date().toISOString(),
    });

    navigate("/");
  }, [quill]);

  return (
    <Stack spacing={2}>
      <Stack direction={"row"} spacing={4}>
        <Stack direction={"row"} spacing={1}>
          <IconButton
            icon={<AiOutlineBold />}
            aria-label="Bold text"
            onClick={onClickFormat("bold")}
          ></IconButton>
          <IconButton
            icon={<AiOutlineItalic />}
            aria-label="Italic text"
            onClick={onClickFormat("italic")}
          ></IconButton>
          <IconButton
            icon={<AiOutlineUnderline />}
            aria-label="Underline text"
            onClick={onClickFormat("underline")}
          ></IconButton>
          <IconButton
            icon={<AiOutlineStrikethrough />}
            aria-label="Strike through"
            onClick={onClickFormat("strike")}
          ></IconButton>
          <IconButton
            icon={<RiSubscript />}
            aria-label="Strike through"
            onClick={onClickFormat("script")}
          ></IconButton>
        </Stack>
        <Stack direction={"row"} spacing={1}>
          <Menu>
            <MenuButton as={Button} rightIcon={<IoChevronDownOutline />}>
              Text
            </MenuButton>
            <MenuList>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <MenuItem onClick={onClickHeader(i)} key={i}>
                  {i === 8 && "Small"}
                  {i === 7 && "Body"}
                  {i < 7 && `Heading ${i}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>{" "}
          <IconButton
            aria-label="Block quote"
            icon={<TbBlockquote />}
            onClick={onClickFormat("blockquote")}
          ></IconButton>
          <ButtonGroup>
            <IconButton
              aria-label="Text align left"
              icon={<AiOutlineAlignLeft />}
              onClick={onClickFormatAlign("left")}
            ></IconButton>
            <IconButton
              aria-label="Text align center"
              icon={<AiOutlineAlignCenter />}
              onClick={onClickFormatAlign("center")}
            ></IconButton>
            <IconButton
              aria-label="Text align right"
              icon={<AiOutlineAlignRight />}
              onClick={onClickFormatAlign("right")}
            ></IconButton>
          </ButtonGroup>
          <IconButton
            aria-label="Unordered list"
            icon={<AiOutlineUnorderedList />}
            onClick={onClickFormatList("bullet")}
          ></IconButton>
          <IconButton
            aria-label="Ordered list"
            icon={<AiOutlineOrderedList />}
            onClick={onClickFormatList("ordered")}
          ></IconButton>
        </Stack>
        <Stack direction={"row"} spacing={1}>
          {" "}
          <EmojiPicker onSelect={onSelectEmoji} />
          <IconButton
            onClick={() => setShowingAddImageDialog(true)}
            aria-label="Attach image"
            icon={<IoImageOutline />}
          />
        </Stack>{" "}
      </Stack>
      <Box
        onKeyUp={onPressTabEditor}
        ref={setupEditor}
        id="editor-text-area"
        sx={editorStyle}
      ></Box>
      <Stack direction={"row"} mt={"-12px !important"}>
        <Button onClick={onSubmitBlog} variant={"solid"} colorScheme="facebook">
          Submit
        </Button>
      </Stack>
      {showingAddImageDialog && (
        <AddMediaDialog
          isOpen={showingAddImageDialog}
          onClose={() => setShowingAddImageDialog(false)}
          primaryButtonHanler={onSubmitImage}
          title="Add image"
        />
      )}
    </Stack>
  );
}
