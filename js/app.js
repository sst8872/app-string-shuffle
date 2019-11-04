$(document).ready(function(){
    $('#title').focus();
    $('#text').autosize();
});

const myForm = document.getElementById('paper');

myForm.addEventListener('submit', makeSentence)

function makeSentence(e) {
    e.preventDefault();
    if (text.value != '') {
        var strValue = text.value.split('\n');
        var result = handleString(strValue);
        console.log(result);
        text.value = result;
        text.style.color = 'green';
        copyToClipboard();
    } else {
        text.style.color = 'red';
        text.value = 'You should enter a sentence.';
        button.disabled = true;
        setTimeout(() => {
            text.value = '';
            button.disable = false;
        }, 2000);
    }
}

function copyToClipboard() {
    button.value = 'Copy to Clipboard';
    text.select();
    button.addEventListener('click', function (e) {
        document.execCommand('copy');
        output.style.color = 'white';
        output.textContent = 'Copied Successfully';
    });
}


function handleString(strArr) {
    if (strArr[0] == "") {
        text.style.color = "red";
        text.textContent = "You should enter a sentence.";
        // Reset the text field
        setTimeout(() => {
            text.style.color = "black";
            text.textContent = "";
        }, 2000);
        return;
    } else {
       return shuffStr(strArr);
    }
}

function shuffStr(arr) {
    var res = arr.map(str => str.split(" "))
        .map(shuffle)
        .map(arr => arr.join(' '))
        .map(str => str.replace(/\.|\?|!|,/g, ''))
        .map(str => {
            return str.toLowerCase()
                .split(' ')
                .join(', ');
        })
        .join('.\n');

    return res;
}

function shuffle (arr) {
    var n = arr.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }

    return arr;
}
