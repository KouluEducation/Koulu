$(function () {

    $('#kl-header a#log-out').click(function (event) {
        event.preventDefault();
        var form = document.createElement('form');
        form.action = '/';
        form.method = 'post';
        var csrf = document.createElement('input');
        csrf.type = 'hidden';
        csrf.name = '_csrf';
        csrf.value = event.target.attributes['data-csrf'].value;
        form.appendChild(csrf);
        var method = document.createElement('input');
        method.type = 'hidden';
        method.name = 'method';
        method.value = 'delete';
        form.appendChild(method);
        form.submit();
    });

});
