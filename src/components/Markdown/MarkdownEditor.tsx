import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function MarkdownEditor() {
  const [content, setContent] = useState('');
  console.log(content);
  return <ReactQuill theme="snow" value={content} onChange={setContent} />;
}

export default MarkdownEditor;
