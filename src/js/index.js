// -----------------------------------------------------------------------------
// Deps
// -----------------------------------------------------------------------------

// global
import jQuery from 'js#/lib/jquery';
// styles
import 'sass#/style.scss';
// scripts
import { demo } from 'js#/modules/demo-module';
import { filter } from './modules/filter';

// -----------------------------------------------------------------------------
// Initialize
// -----------------------------------------------------------------------------

jQuery(function ($) {
	demo();
	filter($('[data-filter]'));
});
