import { useState, forwardRef } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles({
	root: {
		'& .rdw-dropdown-selectedtext': {
			color: 'inherit'
		},
		width: "100%"
	},
	toolbar: {
		borderWidth: '0 0 1px 0!important',
		margin: '0!important'
	},
	wrapper: {},
	editor: {
		padding: '8px 12px',
		height: "125px",
		boxShadow: "inset 0 0 6px #878787",
		'&::-webkit-scrollbar': {
			width: '12px',
			backgroundColor: '#F5F5F5'
		},
		'&::-webkit-scrollbar-track': {
			'-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.3)',
			backgroundColor: '#F5F5F5'
		},
		'&::-webkit-scrollbar-thumb': {
			'-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,.3)',
			backgroundColor: '#a1a1a1'
		}
	}
});

const BlockEditor = forwardRef((props, ref) => {
	const classes = useStyles();

	const [editorState, setEditorState] = useState(EditorState.createEmpty());

	function onEditorStateChange(_editorState) {
		setEditorState(_editorState);
		return props.onChange(draftToHtml(convertToRaw(_editorState.getCurrentContent())));   // THIS IS TO RETURN PARENT FUNCTION CALL VALUE ON PROPS
	}

	return (
		<div className={
            clsx(
                classes.root, 
                'rounded-4 border-1 overflow-hidden w-full', 
                props.className
                )} 
            ref={ref}>

			<Editor
				editorState={editorState}
				toolbarClassName={classes.toolbar}
				wrapperClassName={classes.wrapper}
				editorClassName={classes.editor}
				onEditorStateChange={onEditorStateChange}
				toolbar={{
					options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign']
				}}
			/>
		</div>
	);
});

export default BlockEditor;