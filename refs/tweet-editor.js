import React from "react";
import { render } from "react-dom";
import {
  CompositeDecorator,
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding
} from "draft-js";

class TweetEditorExample extends React.Component {
  constructor() {
    super();
    const compositeDecorator = new CompositeDecorator([
      {
        strategy: handleStrategy,
        component: HandleSpan
      },
      {
        strategy: hashtagStrategy,
        component: HashtagSpan
      }
    ]);
    this.state = {
      editorState: EditorState.createEmpty(compositeDecorator)
    };
    this.focus = () => this.refs.editor.focus();
    this.onChange = editorState => this.setState({ editorState });
    this.logState = () => console.log(this.state.editorState.toJS());
  }
  render() {
    const text = this.state.editorState.getCurrentContent().getPlainText();
    return (
      <div style={styles.root}>
        <div style={styles.editor} onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            placeholder="Write a tweet..."
            ref="editor"
            spellCheck={true}
          />
        </div>
        <input
          onClick={this.logState}
          style={styles.button}
          type="button"
          value="Log State"
        />
      </div>
    );
  }
}
/**
 * Super simple decorators for handles and hashtags, for demonstration
 * purposes only. Don't reuse these regexes.
 */
const HANDLE_REGEX = /@[\w]+/g;
const HASHTAG_REGEX = /#[\w\u0590-\u05ff]+/g;

function handleStrategy(contentBlock, callback, contentState) {
  findWithRegex(HANDLE_REGEX, contentBlock, callback);
}
function hashtagStrategy(contentBlock, callback, contentState) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}

function handleCodeStrategy(contentBolock, callback, contentState) {
  findWithRegex(HANDLE_CODE_REGEX, contentBolock, callback);
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}
const HandleSpan = props => {
  return (
    <span style={styles.handle} data-offset-key={props.offsetKey}>
      {props.children}
    </span>
  );
};
const HashtagSpan = props => {
  return (
    <span style={styles.hashtag} data-offset-key={props.offsetKey}>
      {props.children}
    </span>
  );
};

class MdWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{ border: "2px solid blue" }}>
        <textarea
          type="input"
          placeholder="Please write code here."
          value={this.props.code}
        />
      </div>
    );
  }
}

const styles = {
  root: {
    fontFamily: "'Helvetica', sans-serif",
    padding: 20,
    width: 600
  },
  editor: {
    border: "1px solid #ddd",
    cursor: "text",
    fontSize: 16,
    minHeight: 40,
    padding: 10
  },
  button: {
    marginTop: 10,
    textAlign: "center"
  },
  handle: {
    color: "rgba(98, 177, 254, 1.0)",
    direction: "ltr",
    unicodeBidi: "bidi-override"
  },
  hashtag: {
    color: "rgba(95, 184, 138, 1.0)"
  }
};

export default TweetEditorExample;
