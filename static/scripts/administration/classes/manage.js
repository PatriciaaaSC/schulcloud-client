import printQRs from '../../helpers/printQRs';

function copy(event) {
	event.preventDefault();
	const { copySelector } = event.target.dataset;
	const copySource = document.querySelector(copySelector);
	copySource.select();
	document.execCommand('copy');
	$.showNotification(
		'Der Link wurde in deine Zwischenablage kopiert',
		'success',
		3000,
	);
}
function initializeCopy() {
	document.querySelectorAll('.copy').forEach((btn) => {
		btn.addEventListener('click', copy);
	});
}

function printInvitation(event) {
	event.preventDefault();
	const className = document.querySelector('input[name=class-name]').value;
	const invitationLink = document.querySelector('#invitationLink').value;
	const invitation = {
		href: invitationLink,
		title: `Klasse: ${className}`,
		description: invitationLink,
	};
	const invitations = Array(5).fill(invitation);
	printQRs(invitations);
}

function createInvitationLink() {
	const target = `registration/${$("input[name='classid']").val()}`;
	$.ajax({
		type: 'POST',
		url: '/link/',
		data: {
			target,
		},
		success(data) {
			$('#invitationLink').val(data.newUrl);
		},
	});
}

window.addEventListener('DOMContentLoaded', () => {
	initializeCopy();
	document
		.querySelector('#printInvitation')
		.addEventListener('click', printInvitation);
	createInvitationLink();
});

window.addEventListener('load', () => {
	document
		.getElementById('filter_schoolyear')
		.addEventListener('input', async (event) => {
			// get filtered classes
			const yearId = event.target.value;
			const res = await fetch(
				`/administration/classes/json?yearId=${yearId}`,
				{ credentials: 'same-origin' },
			);
			const classes = await res.json();
			const classInput = document.getElementById(
				'student_from_class_import',
			);

			// update items
			if (classes.total === 0) {
				classInput.innerHTML = '<option value="" disabled>Keine Klassen in diesem Jahrgang vorhanden</option>';
			} else {
				classInput.innerHTML = `${classes.data
					.map(
						item => `<option value="${item._id}">${item.displayName}</option>`,
					)
					.join('')}`;
			}
			$('select[name="classes"]').trigger('chosen:updated');
		});

	const $importModal = $('.import-modal');

	$('.btn-import-class').on('click', (event) => {
		event.preventDefault();
		document
			.querySelectorAll('select[name="classes"] option')
			.forEach((option) => {
				option.selected = false;
			});
		$('select[name="classes"]').trigger('chosen:updated');
		// eslint-ignore-next-line no-undef
		populateModalForm($importModal, {
			title: 'Klasse importieren',
			closeLabel: 'Abbrechen',
			submitLabel: 'Hinzufügen',
		});
		$importModal.appendTo('body').modal('show');
	});

	$importModal.find('.btn-submit').on('click', async (event) => {
		event.preventDefault();
		const selections = $('#student_from_class_import')
			.chosen()
			.val();
		const requestUrl = `/administration/classes/students?classes=${encodeURI(
			JSON.stringify(selections),
		)}`;
		$importModal.modal('hide');
		const res = await fetch(requestUrl, {
			credentials: 'same-origin',
		});
		const students = await res.json();
		students.forEach((student) => {
			document.querySelector(
				`option[value="${student._id}"]`,
			).selected = true;
		});
		sortStudents();
		$('select[name=userIds]').trigger('chosen:updated');
	});

	function handleSendEMails(e){
		e.preventDefault();
		const $this = $(this);
		const text = $this.html();
		const classId = $this.data('class');

		$this.html('E-Mails werden gesendet...');
		$this.attr('disabled', 'disabled');

		$.ajax({
			type: 'GET',
			url: `${
				window.location.origin
			}/administration/users-without-consent/send-email`,
			data: {
				classId,
			},
		})
			.done((data) => {
				$.showNotification(
					'Erinnerungs-E-Mails erfolgreich versendet',
					'success',
					true,
				);
				$this.attr('disabled', false);
				$this.html(text);
			})
			.fail((data) => {
				$.showNotification(
					'Fehler beim senden der Erinnerungs-E-Mails',
					'danger',
					true,
				);
				$this.attr('disabled', false);
				$this.html(text);
			});
	}
	$('.btn-send-links-emails').on('click', handleSendEMails);

	$('.btn-print-links').on('click', function (e) {
		e.preventDefault();
		const $this = $(this);
		const text = $this.html();
		const classId = $this.data('class');

		$this.html('Druckbogen wird generiert...');
		$this.attr('disabled', 'disabled');

		$.ajax({
			type: 'GET',
			url: `${
				window.location.origin
			}/administration/users-without-consent/get-json`,
			data: {
				classId,
			},
		})
			.done((users) => {
				printQRs(
					users.map(user => ({
						href: user.registrationLink.shortLink,
						title: user.fullName,
						description: user.registrationLink.shortLink,
					})),
				);
				$.showNotification(
					'Druckbogen erfolgreich generiert',
					'success',
					true,
				);
				$this.attr('disabled', false);
				$this.html(text);
			})
			.fail((data) => {
				$.showNotification(
					'Problem beim Erstellen des Druckbogens',
					'danger',
					true,
				);
				$this.attr('disabled', false);
				$this.html(text);
			});
	});
});

function sortOptions(selector, sortFunction) {
	const input = document.querySelector(selector);
	const options = Array.from(input.querySelectorAll('option'));

	options.sort(sortFunction);
	options.forEach((option) => {
		input.appendChild(option);
	});
}

function sortStudents() {
	const sortFunction = (a, b) => {
		const a_value = a.dataset.lastName;
		const b_value = b.dataset.lastName;
		if (a_value < b_value) {
			return -1;
		}
		if (a_value > b_value) {
			return 1;
		}
		return 0;
	};

	const studentInputSelector = 'select[name=userIds]';
	sortOptions(studentInputSelector, sortFunction);
	$(studentInputSelector).trigger('chosen:updated');
}
window.addEventListener('load', sortStudents);
