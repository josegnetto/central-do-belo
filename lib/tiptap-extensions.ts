import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

export const tiptapExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    link: { openOnClick: false, autolink: true },
  }),
  Image,
];
