import livesearch from './helpers/livesearch';
import { resizeIframes } from './helpers/iFrameResize';
import './help/contactForm';
import text from './helpers/form_bug_text';

/* eslint-disable max-len */
const MAXIMUM_ALLOWABLE_TOTAL_ATTACHMENTS_SIZE_BYTE = Number($('.form-control-file').data('maxAttachmentSizeMb')) * 1024 * 1024;

$(document).ready(() => {
	$('.btn-poll').on('click', (e) => {
		e.preventDefault();

		document.cookie = 'pollClicked=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/';
	});

	// only fill textarea if empty
	if (!$('textarea[name= problemDescription]').val()) {
		$('textarea[name= problemDescription]').text(text);
	}

	$('.form-control-file').change(function x() {
		const form = $(this).closest('form');
		let fileSize = 0;
		if (this.files.length > 0) {
			for (let i = 0; i <= this.files.length - 1; i += 1) {
				if (this.files.item(i).type.includes('image/')
				|| this.files.item(i).type.includes('video/')
				|| this.files.item(i).type.includes('application/msword')
				|| this.files.item(i).type.includes('application/pdf')) {
					form.find('.file-alert').html('');
					form.find(':submit').prop('disabled', false);
				} else {
					form.find('.file-alert').html(`<i class="fa fa-exclamation"></i> "${this.files.item(i).name}" ist kein Bild, Video oder zulässige Datei`);
					form.find(':submit').prop('disabled', true);
					return;
				}
				fileSize += this.files.item(i).size;
			}
		}
		if (fileSize > MAXIMUM_ALLOWABLE_TOTAL_ATTACHMENTS_SIZE_BYTE) {
			if (this.files.length > 1) {
				form.find('.file-alert').html('<i class="fa fa-exclamation"></i> Die angehängten Dateien überschreiten die maximal zulässige Gesamtgröße!');
			} else {
				form.find('.file-alert').html('<i class="fa fa-exclamation"></i> Die angehängte Datei überschreitet die maximal zulässige Größe!');
			}
			form.find(':submit').prop('disabled', true);
		} else {
			form.find('.file-alert').html('');
			form.find(':submit').prop('disabled', false);
		}
	});
});

// iFrame full height
resizeIframes(undefined, () => {
	document.querySelectorAll('.mobile-warning').forEach((warning) => {
		warning.remove();
	});
	document.querySelectorAll('iframe').forEach((frame) => {
		frame.setAttribute('scrolling', 'no');
	});
});


/* script for iFrame
// this needs to be embedded on every page that should be displayed via iFrame
// and the message to the parent should be send, whenever the page resizes.
// This script shouldn't be removed from here unless it's saved somewhere save where we can find it when needed.

window.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if(message.function){
        if(message.function === "getSize" && message.identifier){
            window.parent.postMessage(JSON.stringify({
                identifier: message.identifier,
                size: {
                    x: document.body.scrollWidth,
                    y: document.body.scrollHeight
                }
            }), '*');
        }
    }
}, false);
*/

// confluence live-search
function truncate(text, length) {
	if (text.length <= length) {
		return text;
	}
	const subString = text.substr(0, length - 1);
	return `${subString.substr(0, subString.lastIndexOf(' '))}...`;
}

function extractResults(result) {
	return result.results;
}

function parseData(result) {
	if (result) {
		return {
			class: '',
			link: `/help/confluence/${result.id}`,
			title: result.title,
			short_description: truncate(result.bodyTextHighlights, 100),
		};
	}
	return {
		class: 'disabled',
		link: '#',
		title: 'Keine Ergebnisse gefunden 😪',
		short_description: 'Probiere es mit anderen Suchbegriffen erneut',
	};
}
const config = {
	// eslint-disable-next-line
	url: 'https://docs.schul-cloud.org/rest/searchv3/1.0/search?queryString=${inputValue}&where=SCDOK&type=page&pageSize=10&highlight=false',
	extractResultArray: extractResults,
	dataParser: parseData,
	livesearchRootSelector: '.live-search',
	inputSelector: 'input.search',
	resultContainerSelector: '.live-search-results',
};
livesearch(config);
