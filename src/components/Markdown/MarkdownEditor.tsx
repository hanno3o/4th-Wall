import React, { useState } from 'react';
import styled from 'styled-components';

const TextArea = styled.textarea`
  width: 100%;
  padding: 50px;
  background-color: #000;
  color: #fff;
  border: #000 solid 1px;
`;

const Preview = styled.div`
  width: 100%;
  padding: 50px;
  border: #000 solid 1px;
`;

function MarkdownEditor() {
  const [text, setText] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const convertToMarkdown = () => {
    let result = text;

    // Replace markdown headings with HTML headings
    result = result.replace(/^#\s(.*)$/gm, '<h1>$1</h1>');
    result = result.replace(/^##\s(.*)$/gm, '<h2>$1</h2>');
    result = result.replace(/^###\s(.*)$/gm, '<h3>$1</h3>');

    // Replace markdown bold with HTML bold
    result = result.replace(/\*\*(.*)\*\*/gm, '<strong>$1</strong>');

    // Replace markdown italic with HTML italic
    result = result.replace(/\*(.*)\*/gm, '<em>$1</em>');

    // Replace markdown links with HTML links
    result = result.replace(/\[(.*)\]\((.*)\)/gm, "<a href='$2'>$1</a>");

    return result;
  };

  return (
    <div className="flex gap-2 h-96">
      <TextArea placeholder="請輸入發文內容..." value={text} onChange={handleChange} />
      <Preview dangerouslySetInnerHTML={{ __html: convertToMarkdown() }} />
    </div>
  );
}

export default MarkdownEditor;
