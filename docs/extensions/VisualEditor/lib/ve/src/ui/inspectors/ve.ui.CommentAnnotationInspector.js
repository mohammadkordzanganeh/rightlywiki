/*!
 * VisualEditor UserInterface CommentAnnotationInspector class.
 *
 * @copyright 2011-2018 VisualEditor Team and others; see http://ve.mit-license.org
 */

/**
 * Inspector for linked content.
 *
 * @class
 * @extends ve.ui.AnnotationInspector
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
ve.ui.CommentAnnotationInspector = function VeUiCommentAnnotationInspector() {
	// Parent constructor
	ve.ui.CommentAnnotationInspector.super.apply( this, arguments );
};

/* Inheritance */

OO.inheritClass( ve.ui.CommentAnnotationInspector, ve.ui.AnnotationInspector );

/* Static properties */

ve.ui.CommentAnnotationInspector.static.name = 'commentAnnotation';

ve.ui.CommentAnnotationInspector.static.title =
	OO.ui.deferMsg( 'visualeditor-commentinspector-title' );

ve.ui.CommentAnnotationInspector.static.modelClasses = [ ve.dm.CommentAnnotation ];

/* Methods */

/**
 * Handle annotation input change events
 *
 * @param {ve.dm.CommentAnnotation} annotation New comment annotation value
 */
ve.ui.CommentAnnotationInspector.prototype.onTextInputChange = function () {
	this.updateActions();
};

/**
 * Update the actions based on the annotation state
 */
ve.ui.CommentAnnotationInspector.prototype.updateActions = function () {
	var isValid = false,
		inspector = this;

	this.textInput.getValidity()
		.then( function () { isValid = true; } )
		.always( function () {
			inspector.actions.forEach( { actions: [ 'done', 'insert' ] }, function ( action ) {
				action.setDisabled( !isValid );
			} );
		} );
};

/**
 * @inheritdoc
 */
ve.ui.CommentAnnotationInspector.prototype.shouldRemoveAnnotation = function () {
	return !this.textInput.getValue();
};

/**
 * @inheritdoc
 */
ve.ui.CommentAnnotationInspector.prototype.getInsertionText = function () {
	return '…';
};

/**
 * @inheritdoc
 */
ve.ui.CommentAnnotationInspector.prototype.getAnnotation = function () {
	return new ve.dm.CommentAnnotation( {
		type: 'commentAnnotation',
		attributes: {
			text: this.textInput.getValue()
		}
	} );
};

/**
 * @inheritdoc
 */
ve.ui.CommentAnnotationInspector.prototype.getAnnotationFromFragment = function () {
	return new ve.dm.CommentAnnotation( {
		type: 'commentAnnotation',
		attributes: {
			text: ''
		}
	} );
};

/**
 * @inheritdoc
 */
ve.ui.CommentAnnotationInspector.prototype.initialize = function () {
	// Parent method
	ve.ui.CommentAnnotationInspector.super.prototype.initialize.call( this );

	// Properties
	this.textInput = new OO.ui.TextInputWidget();

	// Events
	this.textInput.connect( this, { change: 'onTextInputChange' } );

	// Initialization
	this.form.$element.append( this.textInput.$element );
};

/**
 * @inheritdoc
 */
ve.ui.CommentAnnotationInspector.prototype.getSetupProcess = function ( data ) {
	return ve.ui.CommentAnnotationInspector.super.prototype.getSetupProcess.call( this, data )
		.next( function () {
			// Disable surface until animation is complete; will be reenabled in ready()
			this.getFragment().getSurface().disable();
			this.textInput.setValue( this.initialAnnotation.getAttribute( 'text' ) );
			this.updateActions();
		}, this );
};

/**
 * @inheritdoc
 */
ve.ui.CommentAnnotationInspector.prototype.getReadyProcess = function ( data ) {
	return ve.ui.CommentAnnotationInspector.super.prototype.getReadyProcess.call( this, data )
		.next( function () {
			this.textInput.focus().select();
			this.getFragment().getSurface().enable();

			// Clear validation state, so that we don't get "invalid" state immediately on focus
			this.textInput.setValidityFlag( true );
		}, this );
};

/**
 * @inheritdoc
 */
ve.ui.CommentAnnotationInspector.prototype.getHoldProcess = function ( data ) {
	return ve.ui.CommentAnnotationInspector.super.prototype.getHoldProcess.call( this, data )
		.next( function () {
			this.textInput.blur();
		}, this );
};

/**
 * @inheritdoc
 */
ve.ui.CommentAnnotationInspector.prototype.getTeardownProcess = function ( data ) {
	return ve.ui.CommentAnnotationInspector.super.prototype.getTeardownProcess.call( this, data )
		.next( function () {
			this.textInput.setValue( '' );
		}, this );
};

/* Registration */

ve.ui.windowFactory.register( ve.ui.CommentAnnotationInspector );
