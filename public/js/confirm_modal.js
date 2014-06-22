$(function () {

    $('#kl-confirm-modal a#delete').click(function (event) {
        event.preventDefault();
        var form = document.createElement('form');
        form.action = event.target.attributes['href'].value;
        form.method = 'post';
        var csrf = document.createElement('input');
        csrf.type = 'hidden';
        csrf.name = '_csrf';
        csrf.value = event.target.attributes['data-csrf'].value;
        form.appendChild(csrf);
        form.submit();
    });

});
