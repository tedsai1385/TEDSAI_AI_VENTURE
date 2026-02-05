'use client';

import React, { useState, useRef } from 'react';
import { Editor } from '@tiptap/react';
import {
    Undo, Redo, Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, CheckSquare, Quote, Code,
    Heading1, Heading2, Heading3,
    Link as LinkIcon, Image as ImageIcon, Youtube as YoutubeIcon, Table as TableIcon,
    Highlighter, Film, Eraser, Type, ChevronDown, Plus, Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useUpload } from '@/hooks/useUpload';
import { toast } from 'sonner';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface EditorToolbarProps {
    editor: Editor | null;
}

type Tab = 'accueil' | 'insertion' | 'format';

export function EditorToolbar({ editor }: EditorToolbarProps) {
    const [activeTab, setActiveTab] = useState<Tab>('accueil');
    const { upload } = useUpload();
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    // États pour les dialogs YouTube (Optionnel, ici on garde le prompt simple pour la stabilité)
    // Mais on peut faire une petite UI pour Youtube comme proposé par l'utilisateur
    const [showYoutubeDialog, setShowYoutubeDialog] = useState(false);
    const [youtubeUrl, setYoutubeUrl] = useState('');

    if (!editor) return null;

    // Handlers
    const addImage = () => imageInputRef.current?.click();
    const addVideo = () => videoInputRef.current?.click();

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                toast.loading('Upload image...');
                const res = await upload(file, { path: 'articles/content' });
                if (res?.url) {
                    editor.chain().focus().setImage({ src: res.url }).run();
                    toast.dismiss();
                    toast.success('Image insérée');
                }
            } catch (err) {
                toast.dismiss();
                toast.error("Erreur d'upload image");
            } finally {
                if (imageInputRef.current) imageInputRef.current.value = '';
            }
        }
    };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                toast.loading('Upload vidéo...');
                const res = await upload(file, { path: 'articles/videos' });
                if (res?.url) {
                    // @ts-ignore
                    editor.chain().focus().setVideo({ src: res.url }).run();
                    toast.dismiss();
                    toast.success('Vidéo insérée');
                }
            } catch (err) {
                toast.dismiss();
                toast.error("Erreur d'upload vidéo");
            } finally {
                if (videoInputRef.current) videoInputRef.current.value = '';
            }
        }
    };

    const addYoutube = () => {
        const url = window.prompt('URL YouTube :');
        if (url) {
            editor.chain().focus().setYoutubeVideo({ src: url }).run();
        }
    };

    const addLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL du lien :', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const isInTable = editor.can().deleteTable();

    // Composant interne ToolbarButton avec Tooltip (Ajusté selon les styles de l'utilisateur)
    const ToolbarButton = ({
        onClick,
        isActive = false,
        icon: Icon,
        label,
        disabled = false,
        shortcut
    }: {
        onClick: () => void,
        isActive?: boolean,
        icon: any,
        label: string,
        disabled?: boolean,
        shortcut?: string
    }) => (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClick}
                        disabled={disabled}
                        className={cn(
                            "h-8 w-8 p-0 flex items-center justify-center transition-all",
                            isActive
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                : "text-gray-400 hover:text-white hover:bg-gray-800"
                        )}
                        aria-label={label}
                    >
                        <Icon className="w-4 h-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-gray-800 text-white border-gray-700">
                    <div className="flex items-center gap-2">
                        <span>{label}</span>
                        {shortcut && <span className="text-gray-500 bg-gray-900 px-1 rounded text-[10px]">{shortcut}</span>}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );

    return (
        <div className="flex flex-col border-b border-gray-700 bg-gray-900/90 backdrop-blur-md sticky top-0 z-30">
            {/* Ribbon Tabs */}
            <div className="flex items-center px-2 bg-gray-950/20 h-10 border-b border-gray-800/50">
                {['accueil', 'insertion', 'format'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as Tab)}
                        className={cn(
                            "px-4 h-full text-xs font-bold uppercase tracking-wider transition-all border-b-2",
                            activeTab === tab
                                ? "border-purple-500 text-purple-400 bg-purple-500/5"
                                : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Toolbar Content */}
            <div className="p-1.5 flex flex-wrap items-center gap-1 overflow-x-auto min-h-[48px]">
                {activeTab === 'accueil' && (
                    <>
                        <div className="flex items-center gap-0.5 px-1">
                            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} icon={Undo} label="Annuler" shortcut="Ctrl+Z" />
                            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} icon={Redo} label="Rétablir" shortcut="Ctrl+Y" />
                        </div>
                        <Separator orientation="vertical" className="h-6 mx-1 bg-gray-800" />

                        <div className="flex items-center gap-0.5 px-1">
                            <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} label="Gras" shortcut="Ctrl+B" />
                            <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} label="Italique" shortcut="Ctrl+I" />
                            <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={UnderlineIcon} label="Souligné" shortcut="Ctrl+U" />
                            <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} icon={Strikethrough} label="Barré" />
                            <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} icon={Highlighter} label="Surligner" />
                        </div>
                        <Separator orientation="vertical" className="h-6 mx-1 bg-gray-800" />

                        <div className="flex items-center gap-0.5 px-1">
                            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} icon={Heading1} label="Titre 1" />
                            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} icon={Heading2} label="Titre 2" />
                            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} icon={Heading3} label="Titre 3" />
                        </div>
                        <Separator orientation="vertical" className="h-6 mx-1 bg-gray-800" />

                        <div className="flex items-center gap-0.5 px-1">
                            <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} label="Liste puces" />
                            <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} label="Liste numéros" />
                            <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} icon={CheckSquare} label="Checklist" />
                        </div>
                        <Separator orientation="vertical" className="h-6 mx-1 bg-gray-800" />

                        <div className="flex items-center gap-0.5 px-1">
                            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={AlignLeft} label="Gauche" />
                            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={AlignCenter} label="Centré" />
                            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} icon={AlignRight} label="Droite" />
                            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} icon={AlignJustify} label="Justifié" />
                        </div>
                    </>
                )}

                {activeTab === 'insertion' && (
                    <div className="flex items-center gap-1 h-full">
                        <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} icon={LinkIcon} label="Lien" shortcut="Ctrl+K" />

                        <div className="relative">
                            <ToolbarButton onClick={addImage} icon={ImageIcon} label="Image (Upload)" />
                            <input
                                type="file"
                                ref={imageInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>

                        <div className="relative">
                            <ToolbarButton onClick={addVideo} icon={Film} label="Vidéo (Upload)" />
                            <input
                                type="file"
                                ref={videoInputRef}
                                className="hidden"
                                accept="video/*"
                                onChange={handleVideoUpload}
                            />
                        </div>

                        <ToolbarButton onClick={addYoutube} icon={YoutubeIcon} label="YouTube" />

                        <Separator orientation="vertical" className="h-6 mx-1 bg-gray-800" />

                        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={Quote} label="Citation" />
                        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} icon={Code} label="Code" />

                        <Separator orientation="vertical" className="h-6 mx-1 bg-gray-800" />

                        {/* TABLE SECTION */}
                        <div className="flex items-center gap-1 bg-gray-800/20 p-0.5 rounded border border-gray-800/30">
                            <ToolbarButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} icon={TableIcon} label="Insérer Tableau" />
                            {isInTable && (
                                <>
                                    <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().addColumnAfter().run()} className="text-[10px] h-7 px-1 text-purple-400 hover:bg-purple-500/10">+Col</Button>
                                    <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().addRowAfter().run()} className="text-[10px] h-7 px-1 text-purple-400 hover:bg-purple-500/10">+Row</Button>
                                    <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().deleteTable().run()} className="text-[10px] h-7 px-1 text-red-400 hover:bg-red-500/10">Suppr</Button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'format' && (
                    <div className="flex items-center gap-1 h-full">
                        <ToolbarButton onClick={() => editor.chain().focus().toggleSuperscript().run()} isActive={editor.isActive('superscript')} icon={() => <span className="text-xs font-bold italic">x²</span>} label="Exposant" />
                        <ToolbarButton onClick={() => editor.chain().focus().toggleSubscript().run()} isActive={editor.isActive('subscript')} icon={() => <span className="text-xs font-bold italic">x₂</span>} label="Indice" />
                        <Separator orientation="vertical" className="h-6 mx-1 bg-gray-800" />
                        <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().run()} icon={Eraser as any} label="Effacer format" />
                    </div>
                )}
            </div>
        </div>
    );
}
