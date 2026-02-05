import { Node, mergeAttributes } from '@tiptap/core';

export interface VideoOptions {
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        video: {
            /**
             * Set a video node
             */
            setVideo: (options: { src: string }) => ReturnType;
        };
    }
}

export const Video = Node.create<VideoOptions>({
    name: 'video',

    group: 'block',

    atom: true,

    draggable: true,

    addOptions() {
        return {
            HTMLAttributes: {
                controls: true,
                class: 'w-full h-auto rounded-lg shadow-md my-4',
            },
        };
    },

    addAttributes() {
        return {
            src: {
                default: null,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'video[src]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['video', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
    },

    addCommands() {
        return {
            setVideo:
                (options) =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: options,
                        });
                    },
        };
    },
});
