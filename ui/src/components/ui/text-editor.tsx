import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const TextEditor = forwardRef(
    ({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
        const containerRef = useRef(null);
        const quillRef = useRef(null);
        const defaultValueRef = useRef(defaultValue);
        const onTextChangeRef = useRef(onTextChange);
        const onSelectionChangeRef = useRef(onSelectionChange);

        useLayoutEffect(() => {
            onTextChangeRef.current = onTextChange;
            onSelectionChangeRef.current = onSelectionChange;
        });

        useEffect(() => {
            if (quillRef.current) {
                quillRef.current.enable(!readOnly);
            }
        }, [readOnly]);

        useEffect(() => {
            const container = containerRef.current;
            if (!container) return;

            const editorContainer = container.appendChild(
                container.ownerDocument.createElement('div'),
            );

            const quill = new Quill(editorContainer, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        [{ align: [] }],
                        ['link', 'image'],
                        ['clean'],
                    ],
                },
            });

            quillRef.current = quill;

            // Assign to forwarded ref if provided
            if (ref) {
                if (typeof ref === 'function') {
                    ref(quill);
                } else {
                    ref.current = quill;
                }
            }

            if (defaultValueRef.current) {
                quill.setContents(defaultValueRef.current);
            }

            quill.on(Quill.events.TEXT_CHANGE, (...args) => {
                onTextChangeRef.current?.(...args);
            });

            quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
                onSelectionChangeRef.current?.(...args);
            });

            return () => {
                quillRef.current = null;
                if (ref) {
                    if (typeof ref === 'function') {
                        ref(null);
                    } else {
                        ref.current = null;
                    }
                }
                container.innerHTML = '';
            };
        }, [ref]);

        return <div className="rounded-md shadow-sm border border-gray-200" ref={containerRef}></div>;
    },
);

TextEditor.displayName = 'TextEditor';

const { TextEditor }