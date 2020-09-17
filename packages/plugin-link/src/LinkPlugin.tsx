import isUrl from 'is-url';
import { Editor, Range, Node } from 'slate';
import {
  SlashPluginFactory,
  SlashPlugin,
  SlashEditor,
  Transforms,
  isNodeType,
} from '@sheets-editor/core';
import ElementLink from './ElementLink';
import isHotkey from 'is-hotkey';
import { EditorWithLinkPlugin } from './LinkPlugin.types';

export interface LinkPluginOptions {
  hotkey?: string;
}

const unwrapLink = (editor: SlashEditor): void => {
  Transforms.unwrapNodes(editor, {
    match: (n) => n.type === 'link',
    split: true,
  });
};

const isLinkActive = (editor: SlashEditor): boolean => {
  const [link] = Editor.nodes(editor, { match: (n) => n.type === 'link' });
  return !!link;
};

const wrapLink = (editor: SlashEditor, url: string): void => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

const LinkPlugin = (options: LinkPluginOptions = {}): SlashPluginFactory => (
  editor: SlashEditor,
): SlashPlugin => {
  const { insertText, insertData, normalizeNode } = editor;

  editor.insertLink = (url: string): void => {
    if (editor.selection) {
      wrapLink(editor, url);
    }
  };

  editor.removeLink = (): void => {
    if (editor.selection) {
      unwrapLink(editor);
    }
  };

  editor.normalizeNode = (entry): void => {
    const [node, path] = entry;

    if (isNodeType(entry, { allow: ['link'] })) {
      // Don't allow links without a URL
      if (!node.url) {
        Transforms.unwrapNodes(editor, {
          match: (n) => n.type === 'link',
          split: true,
          at: path,
        });
      }

      // Don't allow nested links
      const descendants = Node.descendants(node);
      const links = Array.from(descendants).filter((descEntry) =>
        isNodeType(descEntry, { allow: ['link'] }),
      );

      links.forEach((link) => {
        Transforms.unwrapNodes(editor, {
          match: (n) => n.type === 'link',
          split: true,
          at: link[1],
        });
      });
    }

    return normalizeNode(entry);
  };

  return {
    onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>): void => {
      if (
        isHotkey(options.hotkey || 'mod+k', (event as unknown) as KeyboardEvent)
      ) {
        (editor as EditorWithLinkPlugin).openLinkPopover();
      }
    },
    elements: [
      {
        type: 'link',
        component: ElementLink,
        isInline: true,
      },
    ],
    insertText: (text): void => {
      if (text && isUrl(text)) {
        wrapLink(editor, text);
      } else {
        insertText(text);
      }
    },
    insertData: (data): void => {
      const text = data.getData('text/plain');

      if (text && isUrl(text)) {
        wrapLink(editor, text);
      } else {
        insertData(data);
      }
    },
  };
};

export default LinkPlugin;