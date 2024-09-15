"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import Underline from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Image from '@tiptap/extension-image'
import Document from '@tiptap/extension-document'
import Dropcursor from '@tiptap/extension-dropcursor'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from "@tiptap/extension-list-item";
import Gapcursor from '@tiptap/extension-gapcursor';
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Link from '@tiptap/extension-link'


const Tiptap = ({ onChange, content }: any) => {
  const handleChange = (newContent: string) => {
    onChange(newContent);
  };
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Image,
      BulletList.configure({
        HTMLAttributes: {
          class: 'bullet-list',
        },
      }),
      ListItem,
      Document,
      Dropcursor,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Gapcursor,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "flex flex-col px-4 py-3 justify-start border-b border-r border-l border-gray-700 text-gray-800 w-full gap-3 font-normal text-sm pt-4 rounded-bl-md rounded-br-md outline-none min-h-[132px] overflow-y-hidden overflow-x-hidden",
        style: "word-wrap: break-word; overflow-wrap: break-word;",
      },
    },
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML());
    },
    content: content,
    autofocus: "end",
    immediatelyRender:false
  });

  return (
    <div className="w-full">
      <Toolbar editor={editor} content={content} />
      <EditorContent
        style={{ whiteSpace: "pre-line" }}
        rows={6}
        editor={editor}
      />
    </div>
  );
};

export default Tiptap;
