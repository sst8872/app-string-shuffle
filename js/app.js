let myData = [];
import getSheetLength from "./spreadSheet";
import Export2Doc from "./exportContentToWord";

$(document).ready(function(){
    $('#title').focus();
    $('#text').autosize();
    init();
    getSheetLength(loadJSON)
});

function init() {
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
                button.disabled = false;
            }, 2000);
        }
    }

    function copyToClipboard() {
        button.value = 'Copy to Clipboard';
        text.select();

        makeFile(text.value);

        button.addEventListener('click', function (e) {
            document.execCommand('copy');
            // makeFile(text.value);
            copied.style.color = '#6697ea';
            copied.style.marginBottom = '10px';
            copied.textContent = 'Copied Successfully!';
        });
    }

    function makeFile(data) {
        console.log('song');
        let blob = new Blob([data], { type: 'text/plain' });
        link.href = URL.createObjectURL(blob);
        link.classList.remove('hide');
        // URL.revokeObjectURL(link.href);
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

    return res + '.';
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

function loadJSON(len) {
    let id = "1jlOs08Z4Qt2sJwBK2eXRS8YdTiSPfgCXnFc107UY1g8";
    let urls = [];
    for (let sheetNum = 1; sheetNum <= len; sheetNum++) {
        let jsonURL = `https://spreadsheets.google.com/feeds/list/${id}/${sheetNum}/public/values?alt=json`;
        urls = [...urls, jsonURL];
    }

    Promise.all(
        urls.map(url => {
            return fetch(url)
                .then(res => res.json())
                .then(data => {
                    let tempArr = [];
                    let sheetName = data.feed.title.$t;
                    data.feed.entry.forEach(element => {
                        let holder = {};
                        for (let key in element) {
                            if (key.substring(4) === 'korean') {
                                holder.ko = element[key].$t;
                            } else if (key.substring(4) === 'sentence') {
                                holder.en = element[key].$t;
                            }
                        }
                        tempArr = [...tempArr, holder];
                    });
                    return {
                        key: sheetName,
                        value: tempArr
                    };
                });
        })).then(result => {
            myData = result
            const types = document.querySelectorAll('.sentence');
            types.forEach(type => {
                type.addEventListener('click', function (e) {
                    makeChoice(this.dataset.value);
                })
            })
    });
}

function makeChoice(value) {
    switch (value) {
        case '1' :
            makeWordContent(1)
            break;
        case '2' :
            makeWordContent(2)
            break;
        case '3' :
            makeWordContent(3)
            break;
        case '4' :
            makeWordContent(4)
            break;
        case '5' :
            makeWordContent(5)
            break;
    }
}

function makeWordContent(num) {
    shuffle(myData[num-1].value);
    exportContent.innerHTML = '';
    let tempData = myData[num-1].value;
    // tempData.forEach((sentence, i)=> console.log(`${i+1}. ${sentence.en}`));

    tempData.forEach((sentence, i) => {
        let tempSentence = shuffStr([sentence.en]);
        tempSentence;
        exportContent.innerHTML += `
                                    ${i+1}. ${tempSentence} <span class="korean" style="font-size: 10px">${sentence.ko}</span><br><br>
                                    <div 
                                        class="blank" 
                                        style="border-bottom: 1px solid black;
                                               color: white;
                                               margin-left: 20px;
                                               font-size: 8px;
                                        "
                                        >
                                        ${sentence.en}${sentence.ko}</div><br><br>
                                     `;
    });

    Export2Doc('exportContent', num + ' 형식');
    exportContent.innerHTML = '';
}


