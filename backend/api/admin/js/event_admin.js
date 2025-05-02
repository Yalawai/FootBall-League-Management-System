
document.addEventListener('DOMContentLoaded', function() {
    const eventMinuteField = document.getElementById('id_event_minute');
    const extraTimeFieldWrapper = document.querySelector('.field-extra_time');

    function toggleExtraTimeField() {
        const eventMinute = parseInt(eventMinuteField.value, 10);
        if (eventMinute > 45 && eventMinute <= 60 || eventMinute > 90) {
            extraTimeFieldWrapper.style.display = '';
        } else {
            extraTimeFieldWrapper.style.display = 'none';
            document.getElementById('id_extra_time').value = '';
        }
    }

    eventMinuteField.addEventListener('input', toggleExtraTimeField);
    toggleExtraTimeField();
});
