"use client";

import React, { useEffect, useState } from "react";
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Heading2,
  Underline,
  Quote,
  Heading1,
  Check,
  Pilcrow,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image,
  List,
  ListOrdered,
  Code,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { ColorPicker } from "./ui/color-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

type Props = {
  editor: Editor | null;
  content: string;
};

const Toolbar = ({ editor, content }: Props) => {
  const [color, setColor] = useState<string>("#333");
  const [formating, setFormating] = useState<string>("Paragraph");
  const [formatingIsOpen, setFormatingIsOpen] = useState<boolean>(false);

  const [alignment, setAlignment] = useState("left");
  const [alignmentIsOpen, setAlignmentIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (editor && color) {
      editor.chain().focus().setColor(color).run();
    }
  }, [color, editor]);

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    command: () => void
  ) => {
    e.preventDefault();
    if (editor) {
      command();
    }
  };

  useEffect(() => {
    if (editor) {
      const updateFormating = () => {
        if (editor.isActive("heading", { level: 1 })) setFormating("Heading 1");
        else if (editor.isActive("heading", { level: 2 }))
          setFormating("Heading 2");
        else if (editor.isActive("heading", { level: 3 }))
          setFormating("Heading 3");
        else if (editor.isActive("heading", { level: 4 }))
          setFormating("Heading 4");
        else if (editor.isActive("heading", { level: 5 }))
          setFormating("Heading 5");
        else if (editor.isActive("heading", { level: 6 }))
          setFormating("Heading 6");
        else if (editor.isActive("blockquote")) setFormating("Blockquote");
        else setFormating("Paragraph");
      };

      // Actualizează formatarea când starea editorului se schimbă
      editor.on("update", updateFormating);

      // Cleanup effect
      return () => {
        editor.off("update", updateFormating);
      };
    }
  }, [editor]);

  const buttonsParagraph = [
    {
      icon: Pilcrow,
      command: () => editor?.chain().focus().setParagraph().run(),
      isActive: editor?.isActive("paragraph"),
      name: "Paragraph",
    },
    {
      icon: Heading1,
      command: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor?.isActive("heading", { level: 1 }),
      name: "Heading 1",
    },
    {
      icon: Heading2,
      command: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor?.isActive("heading", { level: 2 }),
      name: "Heading 2",
    },
    {
      icon: Heading3,
      command: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor?.isActive("heading", { level: 3 }),
      name: "Heading 3",
    },
    {
      icon: Heading4,
      command: () => editor?.chain().focus().toggleHeading({ level: 4 }).run(),
      isActive: editor?.isActive("heading", { level: 4 }),
      name: "Heading 4",
    },
    {
      icon: Heading5,
      command: () => editor?.chain().focus().toggleHeading({ level: 5 }).run(),
      isActive: editor?.isActive("heading", { level: 5 }),
      name: "Heading 5",
    },
    {
      icon: Heading6,
      command: () => editor?.chain().focus().toggleHeading({ level: 6 }).run(),
      isActive: editor?.isActive("heading", { level: 6 }),
      name: "Heading 6",
    },
    {
      icon: Quote,
      command: () => editor?.chain().focus().toggleBlockquote().run(),
      isActive: editor?.isActive("blockquote"),
      name: "Blockquote",
    },
  ];

  const buttonsText = [
    {
      icon: Bold,
      command: () => editor?.chain().focus().toggleBold().run(),
      isActive: editor?.isActive("bold"),
      value: "bold",
      ariaLabel: "Toggle Bold",
    },
    {
      icon: Italic,
      command: () => editor?.chain().focus().toggleItalic().run(),
      isActive: editor?.isActive("italic"),
      value: "italic",
      ariaLabel: "Toggle Italic",
    },
    {
      icon: Underline,
      command: () => editor?.chain().focus().toggleUnderline().run(),
      isActive: editor?.isActive("underline"),
      value: "underline",
      ariaLabel: "Toggle Underline",
    },
  ];

  const buttonsAlignment = [
    {
      icon: AlignLeft,
      command: () => editor?.chain().focus().setTextAlign("left").run(),
      isActive: editor?.isActive("left"),
      name: "left",
    },
    {
      icon: AlignCenter,
      command: () => editor?.chain().focus().setTextAlign("center").run(),
      isActive: editor?.isActive("center"),
      name: "center",
    },
    {
      icon: AlignRight,
      command: () => editor?.chain().focus().setTextAlign("right").run(),
      isActive: editor?.isActive("right"),
      name: "right",
    },

    // {
    //   icon: Undo,
    //   command: () => editor?.chain().focus().undo().run(),
    // },
    // {
    //   icon: Redo,
    //   command: () => editor?.chain().focus().redo().run(),
    // },
  ];

  const buttonsListOrder = [
    {
      icon: List,
      command: () => editor?.chain().focus().toggleBulletList().run(),
      isActive: editor?.isActive("bulletList"),
      value: "bulletList"
    },
    {
      icon: ListOrdered,
      command: () => editor?.chain().focus().toggleOrderedList().run(),
      isActive: editor?.isActive("orderedList"),
      value: "orderedList"
    },

    {
      icon: Code,
      command: () => editor?.chain().focus().setCode().run(),
      isActive: editor?.isActive("code"),
      value: "code"
    },
  ];

  const commonButtonClass =
    "p-2 rounded-lg text-sky-400 hover:bg-sky-700 hover:text-white";
  const activeButtonClass = "bg-sky-700 text-white";

  const commonButtonClassFormating = "rounded-none w-full px-2 py-1";
  const activeButtonClassFormating = "bg-gray-100";

  if (!editor) return null;

  return (
    <div
      className="px-4 py-3 bg-gray-100 rounded-tl-md rounded-tr-md flex justify-between items-start
      gap-4 w-full flex-wrap border border-gray-700"
    >
      <div className="flex justify-start items-center gap-4 w-full ">
        <TooltipProvider>
          <div className="relative">
            <Tooltip>
              <TooltipTrigger
                className="flex items-center gap-1 text-sm "
                type="button"
                onClick={() => setFormatingIsOpen(!formatingIsOpen)}
              >
                {formating}
                <ChevronDown className="w-4 h-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Formatting</p>
              </TooltipContent>
            </Tooltip>
            {formatingIsOpen && (
              <div className="absolute z-10 bg-white w-[150px] border rounded-lg flex flex-col h-[200px] overflow-x-scroll">
                {buttonsParagraph.map(
                  ({ icon: Icon, command, isActive, name }, index) => (
                    <li className="list-none" key={index}>
                      <div
                        className={
                          isActive
                            ? "bg-gray-100 flex items-center"
                            : "flex items-center"
                        }
                      >
                        {isActive && (
                          <Check className="w-3 h-3 ml-2" strokeWidth={2.75} />
                        )}
                        <button
                          aria-label="Toggle bold"
                          onClick={(e) => {
                            handleButtonClick(e, command),
                              setFormating(name),
                              setFormatingIsOpen(false);
                          }}
                        >
                          {name}
                        </button>
                      </div>
                      <Separator />
                    </li>
                  )
                )}
              </div>
            )}
          </div>
        </TooltipProvider>

        <Separator className=" h-5" orientation="vertical" />

        <ToggleGroup type="multiple" size={"sm"}>
          {buttonsText.map(
            ({ icon: Icon, command, isActive, value }, index) => (
              <ToggleGroupItem
                key={index}
                value={value}
                onClick={(e) => handleButtonClick(e, command)}
                aria-label="Toggle bold"
                className={
                  isActive
                    ? "bg-gray-300 hover:bg-gray-300 hover:text-gray-800"
                    : "hover:bg-gray-200 hover:text-gray-800"
                }
              >
                <Icon className="w-4 h-4" />
              </ToggleGroupItem>
            )
          )}
        </ToggleGroup>

        <ColorPicker
          className="p-0 w-5 h-5"
          value={color}
          onChange={(ev) => setColor(ev)}
        />
        <Separator className="border-gray-600 h-5" orientation="vertical" />

        <TooltipProvider>
          <div className="relative">
            <Tooltip>
              <TooltipTrigger
                className="flex items-center gap-1 text-sm "
                type="button"
                onClick={() => setAlignmentIsOpen(!alignmentIsOpen)}
              >
                {alignment === "left" && <AlignLeft className="w-5 h-5" />}
                {alignment === "center" && <AlignCenter className="w-5 h-5" />}
                {alignment === "right" && <AlignRight className="w-5 h-5" />}
                <ChevronDown className="w-4 h-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Alignment</p>
              </TooltipContent>
            </Tooltip>
            {alignmentIsOpen && (
              <div className="absolute z-10 bg-white border rounded-lg flex flex-col p-1 overflow-x-scroll">
                {buttonsAlignment.map(
                  ({ icon: Icon, command, isActive, name }, index) => (
                    <li className="list-none" key={index}>
                      <div
                        className={
                          isActive
                            ? "bg-gray-100 flex items-center"
                            : "flex items-center"
                        }
                      >
                        <button
                          onClick={(e) => {
                            handleButtonClick(e, command),
                              setAlignment(name),
                              setAlignmentIsOpen(false);
                          }}
                          className={`${commonButtonClassFormating} ${
                            isActive ? activeButtonClassFormating : ""
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </button>
                      </div>
                      <Separator />
                    </li>
                  )
                )}
              </div>
            )}
          </div>
        </TooltipProvider>
        <Separator className="border-gray-600 h-5" orientation="vertical" />
        <ToggleGroup size={'sm'} type="multiple">
        {buttonsListOrder.map(({ icon: Icon, command, isActive,value }, index) => (
          <ToggleGroupItem
            key={index}
            value={value}
            onClick={(e) => handleButtonClick(e, command)}
            aria-label="Toggle bold"
            className={
              isActive
                ? "bg-gray-300 hover:bg-gray-300 hover:text-gray-800"
                : "hover:bg-gray-200 hover:text-gray-800"
            }
          >
            <Icon className="w-4 h-4" />
          </ToggleGroupItem>
        ))}
        </ToggleGroup>
      </div>
    </div>
  );
};

export default Toolbar;
