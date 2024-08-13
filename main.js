let map;
let marker;
let currentPosition = { lat: 0, lng: 0 };

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 0, lng: 0 },
        zoom: 2,
    });

    map.addListener("click", (e) => {
        placeMarkerAndPanTo(e.latLng, map);
    });
}

function placeMarkerAndPanTo(latLng, map) {
    if (marker) {
        marker.setPosition(latLng);
    } else {
        marker = new google.maps.Marker({
            position: latLng,
            map: map,
        });
    }
    currentPosition = latLng.toJSON();
    map.panTo(latLng);
}

document.getElementById('telegramForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Остановить отправку формы по умолчанию

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const photo = document.getElementById('photo').files[0];

    const botToken = '7211034304:AAGsBbkivdWmaY2HRlriBfAOj-iGIGV-pJk';
    const chatId = '980836947';
    const messageUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const photoUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;

    const fullMessage = `
        Имя: ${name}
        Телефон: ${phone}
        Email: ${email}
        Сообщение: ${message}
        Геопозиция: https://www.google.com/maps?q=${currentPosition.lat},${currentPosition.lng}
    `;

    const messageData = {
        chat_id: chatId,
        text: fullMessage
    };

    // Отправляем сообщение
    fetch(messageUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            // Если сообщение успешно отправлено, отправляем фото
            if (photo) {
                const formData = new FormData();
                formData.append('chat_id', chatId);
                formData.append('photo', photo);

                return fetch(photoUrl, {
                    method: 'POST',
                    body: formData
                });
            } else {
                return Promise.resolve(); // Пропускаем отправку фото
            }
        } else {
            throw new Error('Ошибка при отправке сообщения.');
        }
    })
    .then(response => response ? response.json() : null)
    .then(data => {
        if (data && data.ok) {
            alert('Сообщение и фото успешно отправлены!');
        } else if (!data) {
            alert('Сообщение успешно отправлено!');
        } else {
            alert('Ошибка при отправке фото.');
        }
        clearForm(); // Очищаем форму после успешной отправки
    })
    .catch((error) => {
        console.error('Ошибка:', error);
    });
});

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
    document.getElementById('photo').value = '';
}
