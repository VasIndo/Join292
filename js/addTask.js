document.getElementById('prioHig').addEventListener('click', function() {
    setButtonColors('prioHig', 'rgba(255, 61, 0, 1)', './assets/icon/prio_high_selected.svg');
});

document.getElementById('prioMed').addEventListener('click', function() {
    setButtonColors('prioMed', 'rgba(255, 168, 0, 1)', './assets/icon/prio_medium_selected.svg');
});

document.getElementById('prioLow').addEventListener('click', function() {
    setButtonColors('prioLow', 'rgba(122, 226, 41, 1)', './assets/icon/prio_low_selected.svg');
});

function setButtonColors(activeButtonId, color, imageSrc) {
    // Setzt alle Buttons auf die Standardfarbe (weiß)
    document.getElementById('prioHig').style.backgroundColor = 'white';
    document.getElementById('prioHig').style.color = 'black';
    document.getElementById('prioHig').querySelector('img').src = './assets/icon/Prio alta.svg';

    document.getElementById('prioMed').style.backgroundColor = 'white';
    document.getElementById('prioMed').style.color = 'black';
    document.getElementById('prioMed').querySelector('img').src = './assets/icon/Prio media.svg';

    document.getElementById('prioLow').style.backgroundColor = 'white';
    document.getElementById('prioLow').style.color = 'black';
    document.getElementById('prioLow').querySelector('img').src = './assets/icon/Prio baja.svg';


    // Setzt die Hintergrundfarbe des aktiven Buttons
    const textcolor = 'white';
    document.getElementById(activeButtonId).style.backgroundColor = color;
    document.getElementById(activeButtonId).style.color = textcolor;
    document.getElementById(activeButtonId).querySelector('img').src = imageSrc;
}
