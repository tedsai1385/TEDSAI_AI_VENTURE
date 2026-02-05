'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { extensions } from './extensions';
import { EditorToolbar } from './EditorToolbar';
import { useEffect } from 'react';

interface TedsaiEditorProps {
    content: string;
    onChange: (content: string) => void;
    editable?: boolean;
}

export default function TedsaiEditor({ content, onChange, editable = true }: TedsaiEditorProps) {
    const editor = useEditor({
        extensions: extensions,
        content: content,
        editable: editable,
        immediatelyRender: false, // Fix SSR Hydration Error
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-p:text-gray-300 prose-a:text-purple-400 max-w-none focus:outline-none min-h-[500px] px-8 py-6',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            if (editor.getText() === '' && content === '') return;
            // Évite le re-render constant si le contenu est déjà sync
            // editor.commands.setContent(content); 
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-col border border-gray-700 rounded-lg overflow-hidden bg-gray-900/40 shadow-xl h-[800px]">
            <style jsx global>{`
                .prose ul {
                    list-style-type: disc !important;
                    padding-left: 1.5rem !important;
                    margin-bottom: 1rem !important;
                }
                .prose ol {
                    list-style-type: decimal !important;
                    padding-left: 1.5rem !important;
                    margin-bottom: 1rem !important;
                }
                .prose li p {
                    margin: 0 !important;
                }
                /* Styles pour TaskList */
                .prose ul[data-type="taskList"] {
                    list-style: none !important;
                    padding: 0 !important;
                }
                .prose ul[data-type="taskList"] li {
                    display: flex !important;
                    align-items: flex-start !important;
                    gap: 0.5rem !important;
                    margin-bottom: 0.25rem !important;
                }
                .prose ul[data-type="taskList"] li > label {
                    flex: 0 0 auto !important;
                    user-select: none !important;
                    margin-top: 0.25rem !important;
                }
                .prose ul[data-type="taskList"] li > div {
                    flex: 1 1 auto !important;
                }
                .prose ul[data-type="taskList"] input[type="checkbox"] {
                    cursor: pointer !important;
                    accent-color: #a855f7 !important;
                }
            `}</style>
            <EditorToolbar editor={editor} />

            <div className="flex-1 bg-gray-950/30 overflow-y-auto cursor-text scrollbar-thin scrollbar-thumb-gray-800" onClick={() => editor.chain().focus().run()}>
                <div className="max-w-4xl mx-auto my-4 bg-gray-900/80 min-h-[900px] shadow-2xl border border-gray-800/50">
                    <EditorContent editor={editor} />
                </div>
            </div>

            <div className="bg-gray-900 border-t border-gray-800 p-2 text-xs text-gray-500 flex justify-between items-center px-4">
                <div className="flex gap-4">
                    <span>{editor.storage.characterCount.words()} mots</span>
                    <span>{editor.storage.characterCount.characters()} caractères</span>
                </div>
            </div>
        </div>
    );
}
