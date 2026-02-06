import { StarterKit } from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Youtube } from '@tiptap/extension-youtube';
import { Placeholder } from '@tiptap/extension-placeholder';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Highlight } from '@tiptap/extension-highlight';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { CharacterCount } from '@tiptap/extension-character-count';

import { Video } from './VideoExtension';

export const extensions = [
    StarterKit.configure({
        heading: {
            levels: [1, 2, 3, 4],
        },
    }),
    Placeholder.configure({
        placeholder: 'Commencez à rédiger votre article ici... Tapez "/" pour les commandes.',
    }),
    Image.configure({
        inline: true,
        allowBase64: true,
    }),
    Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
    }),
    Underline,
    Subscript,
    Superscript,
    Highlight,
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
    Table.configure({
        resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    Youtube.configure({
        width: 640,
        height: 480,
    }),
    Video,
    TaskList.configure({
        HTMLAttributes: {
            class: 'not-prose task-list',
        },
    }),
    TaskItem.configure({
        nested: true,
        HTMLAttributes: {
            class: 'task-list-item',
        },
    }),
    CharacterCount,
];
