/* eslint-disable no-undef */
function t(toast) {
	if (!iziToast) {
		// eslint-disable-next-line no-console
		return console.error('iziToast missing to display toasts!');
	}

	iziToast.settings({
		position: 'topRight',
		theme: 'light',
	});

	if (toast === 'notificationsDisabled') {
		return iziToast.warning({
			icon: 'fa fa-envelope',
			title: 'Push-Benachrichtigungen wurden deaktiviert',
			message: 'Klicke zum Aktivieren auf das Icon links neben der Adresszeite und erlaube Benachrichtigungen.',
		});
	}
	if (toast === 'notificationsEnabled') {
		return iziToast.info({
			icon: 'fa fa-envelope',
			title: 'Push-Benachrichtigungen wurden erfolgreich aktiviert',
			message: 'Neuigkeiten können jetzt auf deinem Gerät angezeigt werden.',
		});
	}
	if (toast === 'notificationRegistrationError') {
		return iziToast.error({
			icon: 'fa fa-envelope',
			title: 'Push-Benachrichtigungen konnten nicht aktiviert werden',
			message: 'Beim Aktivieren ist ein interner Fehler aufgetreten.',
		});
	}
	if (toast === 'pushDisabled') {
		return iziToast.show({
			icon: 'fa fa-envelope',
			title: 'Push-Benachrichtigungen wurden deaktiviert.',
		});
	}
	if (toast === 'successfullySendPushTestMessage') {
		return iziToast.show({
			icon: 'fa fa-envelope',
			title: 'Eine Test-Push-Benachrichtigung wurde versendet.',
		});
	}
	if (toast === 'errorSendPushTestMessage') {
		return iziToast.error({
			icon: 'fa fa-envelope',
			title: 'Eine Test-Push-Benachrichtigung konnte nicht versendet werden.',
			message: 'Dies ist ein Serverfehler.',
		});
	}

	// default
	return iziToast.show({
		title: toast,
	});
}

module.exports = t;
