$(document).ready(function () {
    $('.deleteUser').on('click', deleteUser)
	$('.updateFood').on('click', getFood)
})

function deleteUser () {
    var confirmation = confirm('Are You Sure?')

    if (confirmation) {
        $.ajax({
            type: 'DELETE',
            url: '/foods/delete/' + $(this).data('id')
        }).done(function (response) {
            window.location.replace('/')
        })
        window.location.replace('/')
    } else {
        return false;
    }
}

function getFood () {
    window.location.replace('/foods/update/' + $(this).data('id'))
}